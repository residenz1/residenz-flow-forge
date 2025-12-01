import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from './user.entity';

/**
 * BankAccount Entity - Cuentas bancarias de usuarios para payouts
 * Información sensible encriptada
 */
@Entity('bank_accounts')
@Index(['userId'])
@Index(['isVerified'])
export class BankAccount {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @Column({ type: 'varchar', length: 100 })
  bankName!: string;

  @Column({ type: 'varchar', length: 50 })
  accountNumber!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  routingNumber!: string;

  @Column({ type: 'varchar', length: 100 })
  accountHolderName!: string;

  @Column({ type: 'varchar', length: 20 })
  accountType!: string; // SAVINGS, CHECKING, etc.

  @Column({ type: 'varchar', length: 100, nullable: true })
  currency!: string;

  @Column({ type: 'boolean', default: false })
  isVerified!: boolean;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'boolean', default: false })
  isPrimary!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt!: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  verificationToken!: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => User, user => user.bankAccounts, { onDelete: 'CASCADE' })
  user!: User;
}
