import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
  Check,
} from 'typeorm';
import { Account } from './account.entity';
import { Transaction } from './transaction.entity';

export enum LedgerEntryType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

/**
 * LedgerEntry Entity - Double-entry bookkeeping
 * Cada transacción debe tener DEBIT en una cuenta y CREDIT en otra
 * INVARIANTE: SUM(DEBIT) = SUM(CREDIT) por transacción
 */
@Entity('ledger_entries')
@Index(['accountId', 'transactionId'])
@Index(['transactionId'])
@Index(['createdAt'])
@Check(`"entryType" IN ('DEBIT', 'CREDIT')`)
export class LedgerEntry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  transactionId!: string;

  @Column('uuid')
  accountId!: string;

  @Column({
    type: 'enum',
    enum: LedgerEntryType,
  })
  entryType!: LedgerEntryType;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount!: number;

  @Column({ type: 'varchar', length: 255 })
  description!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reference!: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;

  // Relations
  @ManyToOne(() => Transaction, transaction => transaction.ledgerEntries, {
    onDelete: 'CASCADE',
  })
  transaction!: Transaction;

  @ManyToOne(() => Account, account => account.ledgerEntries, {
    onDelete: 'CASCADE',
  })
  account!: Account;
}
