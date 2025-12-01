import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { KycService } from '../services/kyc.service';
import {
  CreateKycSessionDto,
  HandleMetamapWebhookDto,
  ValidateBankAccountDto,
  ApproveKycDto,
  RejectKycDto,
  RetryKycDto,
} from '../dtos';
import { JwtAuthGuard, RolesGuard } from '@common/guards';
import { CurrentUser, Roles, Public } from '@common/decorators';

/**
 * KYC Controller
 * Endpoints para gestión de verificaciones KYC
 * Rutas:
 * - POST   /kyc/sessions              - Crear sesión
 * - GET    /kyc/status                - Obtener estado
 * - POST   /kyc/webhook               - Webhook MetaMap
 * - POST   /kyc/bank-account          - Validar banco
 * - PATCH  /kyc/:id/retry             - Reintentar
 * - PATCH  /kyc/:id/approve           - Aprobar (admin)
 * - PATCH  /kyc/:id/reject            - Rechazar (admin)
 * - GET    /kyc/list                  - Listar (admin)
 */
@Controller('kyc')
@UseGuards(JwtAuthGuard, RolesGuard)
export class KycController {
  constructor(private kycService: KycService) {}

  /**
   * Crear sesión de verificación
   * POST /kyc/sessions
   */
  @Post('sessions')
  @HttpCode(HttpStatus.CREATED)
  @Roles('RESI', 'CLIENT')
  async createKycSession(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateKycSessionDto,
  ) {
    return await this.kycService.createKycSession(userId, dto);
  }

  /**
   * Obtener estado de verificación
   * GET /kyc/status
   */
  @Get('status')
  @Roles('RESI', 'CLIENT', 'ADMIN')
  async getKycStatus(
    @CurrentUser('sub') userId: string,
    @Query('userId') queryUserId?: string,
  ) {
    // Admin puede consultar estado de cualquier usuario
    const targetUserId = queryUserId || userId;
    return await this.kycService.getKycStatus(targetUserId);
  }

  /**
   * Webhook de MetaMap
   * POST /kyc/webhook
   * Recibe resultado de verificación
   */
  @Post('webhook')
  @Public()
  @HttpCode(HttpStatus.OK)
  async handleMetamapWebhook(
    @Headers('x-metamap-signature') signature: string,
    @Body() payload: HandleMetamapWebhookDto,
  ) {
    await this.kycService.handleMetamapWebhook(signature, payload);
    return { success: true };
  }

  /**
   * Validar cuenta bancaria
   * POST /kyc/bank-account
   */
  @Post('bank-account')
  @HttpCode(HttpStatus.CREATED)
  @Roles('RESI', 'CLIENT')
  async validateBankAccount(
    @CurrentUser('sub') userId: string,
    @Body() dto: ValidateBankAccountDto,
  ) {
    return await this.kycService.validateBankAccount(userId, dto);
  }

  /**
   * Reintentar verificación
   * PATCH /kyc/retry
   */
  @Patch('retry')
  @HttpCode(HttpStatus.OK)
  @Roles('RESI', 'CLIENT')
  async retryKyc(
    @CurrentUser('sub') userId: string,
    @Body() dto: RetryKycDto,
  ) {
    return await this.kycService.retryKyc(userId, dto);
  }

  /**
   * Aprobar KYC (admin override)
   * PATCH /kyc/:id/approve
   */
  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK)
  @Roles('ADMIN')
  async approveKyc(
    @Param('id') kycVerificationId: string,
    @Body() dto: ApproveKycDto,
  ) {
    await this.kycService.approveKyc(kycVerificationId, dto);
    return { success: true, message: 'KYC approved' };
  }

  /**
   * Rechazar KYC (admin override)
   * PATCH /kyc/:id/reject
   */
  @Patch(':id/reject')
  @HttpCode(HttpStatus.OK)
  @Roles('ADMIN')
  async rejectKyc(
    @Param('id') kycVerificationId: string,
    @Body() dto: RejectKycDto,
  ) {
    await this.kycService.rejectKyc(kycVerificationId, dto);
    return { success: true, message: 'KYC rejected' };
  }

  /**
   * Listar verificaciones pendientes (admin)
   * GET /kyc/list
   */
  @Get('list')
  @Roles('ADMIN')
  async listKycVerifications() {
    return await this.kycService.getPendingVerifications();
  }

  /**
   * Obtener estadísticas KYC (admin)
   * GET /kyc/stats
   */
  @Get('stats')
  @Roles('ADMIN')
  async getKycStats() {
    return await this.kycService.getKycStats();
  }
}
