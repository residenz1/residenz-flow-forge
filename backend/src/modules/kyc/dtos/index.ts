import {
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export enum KycDocumentType {
  DNI = 'DNI',
  PASSPORT = 'PASSPORT',
  DRIVER_LICENSE = 'DRIVER_LICENSE',
}

export enum KycStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

/**
 * Create KYC Session DTO
 * Inicia proceso de verificación con MetaMap
 */
export class CreateKycSessionDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(KycDocumentType)
  @IsOptional()
  documentType?: KycDocumentType;

  @IsString()
  @IsOptional()
  documentNumber?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * Handle MetaMap Webhook DTO
 * Respuesta de MetaMap después de verificación
 */
export class HandleMetamapWebhookDto {
  @IsString()
  sessionId: string = '';

  @IsString()
  status: 'verified' | 'rejected' | 'pending' | 'expired' = 'pending';

  @IsNumber()
  @Min(0)
  @Max(1)
  livenessScore: number = 0;

  @IsNumber()
  @Min(0)
  @Max(1)
  documentScore: number = 0;

  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @IsString()
  @IsOptional()
  documentNumber?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * Validate Bank Account DTO
 * Validar cuenta bancaria con Prometeo
 */
export class ValidateBankAccountDto {
  @IsString()
  bankName: string = '';

  @IsString()
  accountNumber: string = '';

  @IsString()
  routingNumber: string = '';

  @IsString()
  accountHolderName: string = '';

  @IsString()
  @IsOptional()
  accountType?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * Get KYC Status DTO
 * Obtener estado actual de verificación
 */
export class GetKycStatusDto {
  @IsUUID()
  @IsOptional()
  userId?: string;
}

/**
 * Retry KYC DTO
 * Reintentar verificación después de rechazo
 */
export class RetryKycDto {
  @IsString()
  reason?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * List KYC Verifications Query DTO
 * Filtrar y paginar verificaciones
 */
export class ListKycVerificationsDto {
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

/**
 * Upload KYC Document DTO
 * Subir documento manualmente (alternativa a MetaMap)
 */
export class UploadKycDocumentDto {
  @IsEnum(KycDocumentType)
  documentType: KycDocumentType = KycDocumentType.DNI;

  @IsString()
  documentNumber: string = '';

  @IsString()
  @IsOptional()
  documentUrl?: string;

  @IsString()
  @IsOptional()
  selfieUrl?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * Approve KYC DTO
 * Aprobar KYC manualmente (admin override)
 */
export class ApproveKycDto {
  @IsString()
  reason: string = '';

  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * Reject KYC DTO
 * Rechazar KYC con razón
 */
export class RejectKycDto {
  @IsString()
  reason: string = '';

  @IsOptional()
  metadata?: Record<string, any>;
}
