import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KycVerification, KycVerificationStatus } from '@database/entities';

/**
 * KYC Verification Repository
 * Custom data access para verificaciones KYC
 */
@Injectable()
export class KycVerificationRepository {
  constructor(
    @InjectRepository(KycVerification)
    private repository: Repository<KycVerification>,
  ) {}

  /**
   * Crear nueva verificación KYC
   */
  async create(verification: Partial<KycVerification>): Promise<KycVerification> {
    const newVerification = this.repository.create(verification);
    return await this.repository.save(newVerification);
  }

  /**
   * Obtener verificación por ID
   */
  async findById(id: string): Promise<KycVerification> {
    const verification = await this.repository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!verification) {
      throw new NotFoundException(`KYC Verification ${id} not found`);
    }

    return verification;
  }

  /**
   * Obtener verificación por usuario
   */
  async findByUserId(userId: string): Promise<KycVerification | null> {
    return await this.repository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  /**
   * Obtener verificación por MetaMap session ID
   */
  async findBySessionId(sessionId: string): Promise<KycVerification | null> {
    return await this.repository.findOne({
      where: { metamapSessionId: sessionId },
      relations: ['user'],
    });
  }

  /**
   * Listar verificaciones con filtros
   */
  async findAll(filters?: {
    status?: string;
    skip?: number;
    take?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<[KycVerification[], number]> {
    const query = this.repository
      .createQueryBuilder('kyc')
      .leftJoinAndSelect('kyc.user', 'user');

    if (filters?.status) {
      query.where('kyc.status = :status', { status: filters.status });
    }

    if (filters?.sortBy) {
      query.orderBy(`kyc.${filters.sortBy}`, filters.sortOrder || 'DESC');
    } else {
      query.orderBy('kyc.createdAt', 'DESC');
    }

    if (filters?.skip !== undefined) {
      query.skip(filters.skip);
    }

    if (filters?.take !== undefined) {
      query.take(filters.take);
    }

    return await query.getManyAndCount();
  }

  /**
   * Obtener verificaciones por estado
   */
  async findByStatus(
    status: KycVerificationStatus,
    skip: number = 0,
    take: number = 20,
  ): Promise<[KycVerification[], number]> {
    return await this.repository.findAndCount({
      where: { status },
      skip,
      take,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  /**
   * Obtener verificaciones vencidas
   */
  async findExpiredVerifications(): Promise<KycVerification[]> {
    const now = new Date();

    return await this.repository
      .createQueryBuilder('kyc')
      .where('kyc.expiresAt IS NOT NULL')
      .andWhere('kyc.expiresAt <= :now', { now })
      .andWhere('kyc.status != :status', { status: KycVerificationStatus.EXPIRED })
      .getMany();
  }

  /**
   * Obtener verificaciones pendientes
   */
  async findPendingVerifications(): Promise<KycVerification[]> {
    return await this.repository.find({
      where: { status: KycVerificationStatus.PENDING },
      order: { createdAt: 'ASC' },
      relations: ['user'],
      take: 100,
    });
  }

  /**
   * Actualizar verificación
   */
  async update(id: string, updates: Partial<KycVerification>): Promise<KycVerification> {
    await this.repository.update(id, updates);
    return await this.findById(id);
  }

  /**
   * Obtener estadísticas de KYC
   */
  async getStats(): Promise<{
    totalVerifications: number;
    approved: number;
    rejected: number;
    pending: number;
    expired: number;
    approvalRate: number;
  }> {
    const total = await this.repository.count();
    const approved = await this.repository.count({ where: { status: KycVerificationStatus.APPROVED } });
    const rejected = await this.repository.count({ where: { status: KycVerificationStatus.REJECTED } });
    const pending = await this.repository.count({ where: { status: KycVerificationStatus.PENDING } });
    const expired = await this.repository.count({ where: { status: KycVerificationStatus.EXPIRED } });

    return {
      totalVerifications: total,
      approved,
      rejected,
      pending,
      expired,
      approvalRate: total > 0 ? (approved / total) * 100 : 0,
    };
  }

  /**
   * Obtener histórico de intentos de usuario
   */
  async getUserHistory(userId: string, limit: number = 10): Promise<KycVerification[]> {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['user'],
    });
  }
}
