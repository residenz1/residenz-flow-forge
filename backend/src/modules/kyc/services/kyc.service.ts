import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KycVerification, User, KycVerificationStatus } from '@database/entities';
import { KycVerificationRepository } from '../repositories/kyc-verification.repository';
import { MetamapService } from '../integrations/metamap.service';
import { PrometeoService } from '../integrations/prometeo.service';
import {
  CreateKycSessionDto,
  HandleMetamapWebhookDto,
  ValidateBankAccountDto,
  ApproveKycDto,
  RejectKycDto,
  RetryKycDto,
} from '../dtos';

/**
 * KYC Service
 * Gestión completa del proceso de verificación KYC
 * Incluye:
 * - Sesiones MetaMap
 * - Validación de documentos
 * - Verificación de cuentas bancarias (Prometeo)
 * - Gestión de estado de verificación
 */
@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);

  constructor(
    private kycRepository: KycVerificationRepository,
    private metamapService: MetamapService,
    private prometeoService: PrometeoService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Crear sesión de verificación KYC
   * Inicia el proceso con MetaMap
   */
  async createKycSession(
    userId: string,
    dto: CreateKycSessionDto,
  ): Promise<{
    kycVerificationId: string;
    clientToken: string;
    sessionId: string;
    expiresAt: Date;
  }> {
    this.logger.log(`Creating KYC session for user: ${userId}`);

    // Obtener usuario
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    // Verificar si ya tiene una verificación activa
    const existingVerification = await this.kycRepository.findByUserId(userId);
    if (existingVerification && existingVerification.status === 'PENDING') {
      throw new BadRequestException('User already has an active KYC session');
    }

    try {
      // Crear sesión con MetaMap
      const metamapSession = await this.metamapService.createSession({
        email: dto.email || user.email,
        phone: dto.phone || user.phone,
        firstName: dto.firstName || user.firstName,
        lastName: dto.lastName || user.lastName,
      });

      // Crear verificación en base de datos
      const verification = await this.kycRepository.create({
        userId,
        status: KycVerificationStatus.PENDING,
        metamapSessionId: String(metamapSession.sessionId),
        livenessScore: '0',
        documentScore: '0',
        metadata: {
          ...dto.metadata,
          createdAt: new Date(),
          sessionStartedAt: new Date(),
        },
        expiresAt: metamapSession.expiresAt,
      });

      this.logger.log(
        `KYC session created: ${verification.id}, MetaMap session: ${metamapSession.sessionId}`,
      );

      // Emitir evento
      this.eventEmitter.emit('kyc.session_created', {
        kycVerificationId: verification.id,
        userId,
        sessionId: metamapSession.sessionId,
      });

      return {
        kycVerificationId: verification.id,
        clientToken: metamapSession.clientToken,
        sessionId: metamapSession.sessionId,
        expiresAt: metamapSession.expiresAt,
      };
    } catch (error) {
      const err = error as any;
      this.logger.error(`Error creating KYC session: ${err.message}`, err.stack);
      throw error;
    }
  }

  /**
   * Manejar webhook de MetaMap
   * Procesar resultado de verificación
   */
  async handleMetamapWebhook(
    signature: string,
    payload: HandleMetamapWebhookDto,
  ): Promise<void> {
    this.logger.log(`Processing MetaMap webhook for session: ${payload.sessionId}`);

    // Validar firma del webhook
    const isValid = this.metamapService.validateWebhook(payload, signature);
    if (!isValid) {
      this.logger.warn(`Invalid webhook signature for session: ${payload.sessionId}`);
      throw new BadRequestException('Invalid webhook signature');
    }

    // Obtener verificación
    const verification = await this.kycRepository.findBySessionId(payload.sessionId);
    if (!verification) {
      this.logger.warn(`KYC verification not found for session: ${payload.sessionId}`);
      throw new NotFoundException(`KYC verification not found`);
    }

    // Actualizar scores
      const updates: Partial<KycVerification> = {
        livenessScore: String(payload.livenessScore),
        documentScore: String(payload.documentScore),
      metadata: {
        ...verification.metadata,
        metamapResult: payload,
        webhookProcessedAt: new Date(),
      },
    };

    // Determinar estado basado en scores
    const minLivenessScore = 0.7;
    const minDocumentScore = 0.7;

    if (payload.status === 'verified' || payload.status === 'pending') {
      if (
        payload.livenessScore >= minLivenessScore &&
        payload.documentScore >= minDocumentScore
      ) {
        updates.status = KycVerificationStatus.APPROVED;
        updates.approvedAt = new Date();
        this.logger.log(`KYC approved for user: ${verification.userId}`);

        // Emitir evento de aprobación
        this.eventEmitter.emit('kyc.approved', {
          kycVerificationId: verification.id,
          userId: verification.userId,
          livenessScore: payload.livenessScore,
          documentScore: payload.documentScore,
        });
      } else {
        updates.status = KycVerificationStatus.PENDING;
        this.logger.log(
          `KYC pending further verification: liveness=${payload.livenessScore}, document=${payload.documentScore}`,
        );
      }
    } else if (payload.status === 'rejected') {
      updates.status = KycVerificationStatus.REJECTED;
      updates.rejectionReason = payload.rejectionReason || 'Document verification failed';
      this.logger.log(`KYC rejected for user: ${verification.userId}`);

      // Emitir evento de rechazo
      this.eventEmitter.emit('kyc.rejected', {
        kycVerificationId: verification.id,
        userId: verification.userId,
        reason: updates.rejectionReason,
      });
    } else if (payload.status === 'expired') {
      updates.status = KycVerificationStatus.EXPIRED;
      this.logger.log(`KYC session expired: ${payload.sessionId}`);

      this.eventEmitter.emit('kyc.expired', {
        kycVerificationId: verification.id,
        userId: verification.userId,
      });
    }

    // Guardar actualización
    await this.kycRepository.update(verification.id, updates);

    // Si está aprobado, actualizar usuario y procesar banco
    if (updates.status === KycVerificationStatus.APPROVED) {
      await this.userRepository.update(verification.userId, {
        kycStatus: 'APPROVED' as any,
      });

      this.logger.log(`User KYC status updated to APPROVED: ${verification.userId}`);
    }
  }

  /**
   * Validar cuenta bancaria con Prometeo
   */
  async validateBankAccount(
    userId: string,
    dto: ValidateBankAccountDto,
  ): Promise<{
    isValid: boolean;
    bankCode: string;
    accountType?: string;
  }> {
    this.logger.log(`Validating bank account for user: ${userId}`);

    // Verificar que el usuario esté aprobado en KYC
    const verification = await this.kycRepository.findByUserId(userId);
    if (!verification || verification.status !== 'APPROVED') {
      throw new BadRequestException('User must complete KYC before adding bank account');
    }

    // Validar con Prometeo
    const result = await this.prometeoService.validateBankAccount({
      bankName: dto.bankName,
      accountNumber: dto.accountNumber,
      routingNumber: dto.routingNumber,
      accountHolderName: dto.accountHolderName,
    });

    if (result.isValid && result.ownerMatch) {
      this.logger.log(
        `Bank account validated successfully for user: ${userId}`,
      );

      // Emitir evento
      this.eventEmitter.emit('kyc.bank_verified', {
        userId,
        bankCode: result.bankCode,
        accountType: result.accountType,
      });
    } else {
      this.logger.warn(
        `Bank validation failed for user: ${userId}, reason: ${result.errorMessage}`,
      );

      throw new BadRequestException(
        result.errorMessage || 'Bank account validation failed',
      );
    }

    return {
      isValid: result.isValid,
      bankCode: result.bankCode,
      accountType: result.accountType,
    };
  }

  /**
   * Obtener estado de verificación
   */
  async getKycStatus(userId: string): Promise<{
    status: string;
    kycVerificationId: string;
    livenessScore: number;
    documentScore: number;
    approvedAt?: Date;
    expiresAt?: Date;
    bankAccountVerified?: boolean;
    rejectionReason?: string;
  }> {
    const verification = await this.kycRepository.findByUserId(userId);
    if (!verification) {
      throw new NotFoundException(`No KYC verification found for user: ${userId}`);
    }

    return {
      status: verification.status,
      kycVerificationId: verification.id,
      livenessScore: Number(verification.livenessScore) || 0,
      documentScore: Number(verification.documentScore) || 0,
      approvedAt: verification.approvedAt,
      expiresAt: verification.expiresAt,
      bankAccountVerified: verification.bankAccountVerified || false,
      rejectionReason: verification.rejectionReason,
    };
  }

  /**
   * Reintentar verificación después de rechazo
   */
  async retryKyc(userId: string, dto: RetryKycDto): Promise<{
    kycVerificationId: string;
    clientToken: string;
    sessionId: string;
  }> {
    this.logger.log(`Retrying KYC for user: ${userId}`);

    // Obtener última verificación
    const lastVerification = await this.kycRepository.findByUserId(userId);
    if (!lastVerification || lastVerification.status !== 'REJECTED') {
      throw new BadRequestException('User cannot retry KYC at this time');
    }

    // Crear nueva sesión
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const metamapSession = await this.metamapService.createSession({
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    // Crear nueva verificación
    const verification = await this.kycRepository.create({
      userId,
      status: KycVerificationStatus.PENDING,
      metamapSessionId: metamapSession.sessionId,
      livenessScore: '0',
      documentScore: '0',
      metadata: {
        retryReason: dto.reason,
        previousVerificationId: lastVerification.id,
        retryAttempt: (lastVerification.metadata?.retryAttempt || 0) + 1,
      },
    });

    this.logger.log(`KYC retry session created: ${verification.id}`);

    this.eventEmitter.emit('kyc.retry_started', {
      kycVerificationId: verification.id,
      userId,
      previousVerificationId: lastVerification.id,
    });

    return {
      kycVerificationId: verification.id,
      clientToken: metamapSession.clientToken,
      sessionId: metamapSession.sessionId,
    };
  }

  /**
   * Aprobar KYC manualmente (admin override)
   */
  async approveKyc(kycVerificationId: string, dto: ApproveKycDto): Promise<void> {
    this.logger.log(`Approving KYC manually: ${kycVerificationId}`);

    const verification = await this.kycRepository.findById(kycVerificationId);

    const updated = await this.kycRepository.update(kycVerificationId, {
      status: KycVerificationStatus.APPROVED,
      approvedAt: new Date(),
      metadata: {
        ...verification.metadata,
        manualApprovalReason: dto.reason,
        manualApprovalAt: new Date(),
      },
    });

    // Actualizar usuario
    await this.userRepository.update(verification.userId, {
      kycStatus: 'APPROVED' as any,
    });

    this.logger.log(`KYC approved manually for user: ${verification.userId}`);

    this.eventEmitter.emit('kyc.manually_approved', {
      kycVerificationId: updated.id,
      userId: verification.userId,
      reason: dto.reason,
    });
  }

  /**
   * Rechazar KYC manualmente
   */
  async rejectKyc(kycVerificationId: string, dto: RejectKycDto): Promise<void> {
    this.logger.log(`Rejecting KYC manually: ${kycVerificationId}`);

    const verification = await this.kycRepository.findById(kycVerificationId);

    const updated = await this.kycRepository.update(kycVerificationId, {
      status: KycVerificationStatus.REJECTED,
      rejectionReason: dto.reason,
      metadata: {
        ...verification.metadata,
        manualRejectionReason: dto.reason,
        manualRejectionAt: new Date(),
      },
    });

    // Actualizar usuario
    await this.userRepository.update(verification.userId, {
      kycStatus: 'REJECTED' as any,
    });

    this.logger.log(`KYC rejected manually for user: ${verification.userId}`);

    this.eventEmitter.emit('kyc.manually_rejected', {
      kycVerificationId: updated.id,
      userId: verification.userId,
      reason: dto.reason,
    });
  }

  /**
   * Obtener verificaciones pendientes (para workers)
   */
  async getPendingVerifications(): Promise<KycVerification[]> {
    return await this.kycRepository.findPendingVerifications();
  }

  /**
   * Procesar verificaciones vencidas
   * Se ejecuta periódicamente (scheduled job)
   */
  async expireOldVerifications(): Promise<number> {
    const expired = await this.kycRepository.findExpiredVerifications();

    for (const verification of expired) {
      await this.kycRepository.update(verification.id, {
        status: KycVerificationStatus.EXPIRED,
      });

      this.eventEmitter.emit('kyc.expired', {
        kycVerificationId: verification.id,
        userId: verification.userId,
      });
    }

    this.logger.log(`Expired ${expired.length} old KYC verifications`);
    return expired.length;
  }

  /**
   * Obtener estadísticas de KYC
   */
  async getKycStats(): Promise<any> {
    return await this.kycRepository.getStats();
  }
}
