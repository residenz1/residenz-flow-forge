import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
  Check,
} from 'typeorm';
import { Account } from './account.entity';
import { BankAccount } from './bank-account.entity';
import { Booking } from './booking.entity';
import { KycVerification } from './kyc-verification.entity';
import { ChatConversation } from './chat-conversation.entity';

export enum UserRole {
  CLIENT = 'CLIENT',
  RESI = 'RESI',
  ADMIN = 'ADMIN',
}

export enum KycStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

/**
 * User Entity - Representa usuarios del sistema (clientes, residentes, admins)
 * Incluye información de autenticación, KYC y perfil
 */
@Entity('users')
@Index(['email'], { unique: true })
@Index(['phone'], { unique: true })
@Index(['role'])
@Index(['kycStatus'])
@Check(`"role" IN ('CLIENT', 'RESI', 'ADMIN')`)
@Check(`"kycStatus" IN ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED')`)
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  phone!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', length: 100 })
  firstName!: string;

  @Column({ type: 'varchar', length: 100 })
  lastName!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role!: UserRole;

  @Column({ type: 'enum', enum: KycStatus, default: KycStatus.PENDING })
  kycStatus!: KycStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profilePhotoUrl!: string;

  @Column({ type: 'text', nullable: true })
  bio!: string;

  @Column({ type: 'float', nullable: true })
  rating!: number;

  @Column({ type: 'int', default: 0 })
  totalReviews!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'boolean', default: false })
  twoFactorEnabled!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  twoFactorSecret!: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt!: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  preferredLanguage!: string;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  metadata!: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @OneToMany(() => Account, account => account.user)
  accounts!: Account[];

  @OneToMany(() => BankAccount, bankAccount => bankAccount.user)
  bankAccounts!: BankAccount[];

  @OneToMany(() => Booking, booking => booking.client)
  clientBookings!: Booking[];

  @OneToMany(() => Booking, booking => booking.resi)
  resiBookings!: Booking[];

  @OneToMany(() => KycVerification, kyc => kyc.user)
  kycVerifications!: KycVerification[];

  @OneToMany(() => ChatConversation, conversation => conversation.user1)
  conversations1!: ChatConversation[];

  @OneToMany(() => ChatConversation, conversation => conversation.user2)
  conversations2!: ChatConversation[];
}
