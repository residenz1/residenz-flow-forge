import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
  Check,
} from 'typeorm';
import { User } from './user.entity';

export enum KycVerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export enum KycDocumentType {
  DNI = 'DNI',
  PASSPORT = 'PASSPORT',
  DRIVER_LICENSE = 'DRIVER_LICENSE',
}

/**
 * KycVerification Entity - Registro de verificaciones KYC
 * Integración con MetaMap
 */
@Entity('kyc_verifications')
@Index(['userId'])
@Index(['status'])
@Index(['metamapSessionId'])
@Check(`"status" IN ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED')`)
@Check(`"documentType" IN ('DNI', 'PASSPORT', 'DRIVER_LICENSE')`)
export class KycVerification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @Column({
    type: 'enum',
    enum: KycVerificationStatus,
    default: KycVerificationStatus.PENDING,
  })
  status!: KycVerificationStatus;

  @Column({
    type: 'enum',
    enum: KycDocumentType,
  })
  documentType!: KycDocumentType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  documentNumber!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  metamapSessionId!: string;

  @Column({ type: 'jsonb', nullable: true })
  metamapResult!: Record<string, any>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  livenessScore!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  documentScore!: string;

  @Column({ type: 'text', nullable: true })
  rejectionReason!: string;

  @Column({ type: 'boolean', default: false })
  bankAccountVerified!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bankVerificationToken!: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt!: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => User, user => user.kycVerifications, {
    onDelete: 'CASCADE',
  })
  user!: User;
}
