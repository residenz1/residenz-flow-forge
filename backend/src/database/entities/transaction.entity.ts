import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
  Check,
} from 'typeorm';
import { Account } from './account.entity';
import { Booking } from './booking.entity';
import { LedgerEntry } from './ledger-entry.entity';

export enum TransactionType {
  BOOKING_PAYOUT = 'BOOKING_PAYOUT',
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  REFUND = 'REFUND',
  INTERNAL_TRANSFER = 'INTERNAL_TRANSFER',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SETTLED = 'SETTLED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

/**
 * Transaction Entity - Registro de transacciones financieras
 * Core de la contabilidad con double-entry ledger
 */
@Entity('transactions')
@Index(['type'])
@Index(['status'])
@Index(['bookingId'])
@Index(['createdAt'])
@Check(`"type" IN ('BOOKING_PAYOUT', 'DEPOSIT', 'WITHDRAWAL', 'REFUND', 'INTERNAL_TRANSFER', 'ADJUSTMENT')`)
@Check(`"status" IN ('PENDING', 'PROCESSING', 'SETTLED', 'FAILED', 'CANCELLED')`)
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type!: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status!: TransactionStatus;

  @Column('uuid', { nullable: true })
  sourceAccountId!: string;

  @Column('uuid', { nullable: true })
  destinationAccountId!: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount!: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency!: string;

  @Column('uuid', { nullable: true })
  bookingId!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  externalId!: string; // Stripe transaction ID, etc.

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  failedAt!: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  failureReason!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => Account, account => account.sourceTransactions, {
    nullable: true,
  })
  sourceAccount!: Account;

  @ManyToOne(() => Account, account => account.destinationTransactions, {
    nullable: true,
  })
  destinationAccount!: Account;

  @ManyToOne(() => Booking, booking => booking.transactions, {
    nullable: true,
  })
  booking!: Booking;

  @OneToMany(() => LedgerEntry, entry => entry.transaction)
  ledgerEntries!: LedgerEntry[];
}
