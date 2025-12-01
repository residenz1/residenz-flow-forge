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
import { User } from './user.entity';
import { Transaction } from './transaction.entity';
import { LedgerEntry } from './ledger-entry.entity';

export enum AccountType {
  WALLET = 'WALLET',
  ESCROW = 'ESCROW',
  RESERVE = 'RESERVE',
}

/**
 * Account Entity - Representa cuentas de usuario (wallet, escrow, reserve)
 * Utiliza patrón double-entry ledger para contabilidad
 */
@Entity('accounts')
@Index(['userId', 'type'])
@Check(`"type" IN ('WALLET', 'ESCROW', 'RESERVE')`)
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @Column({
    type: 'enum',
    enum: AccountType,
    default: AccountType.WALLET,
  })
  type!: AccountType;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  balance!: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  frozenBalance!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  currency!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => User, user => user.accounts, { onDelete: 'CASCADE' })
  user!: User;

  @OneToMany(() => Transaction, transaction => transaction.sourceAccount)
  sourceTransactions!: Transaction[];

  @OneToMany(() => Transaction, transaction => transaction.destinationAccount)
  destinationTransactions!: Transaction[];

  @OneToMany(() => LedgerEntry, entry => entry.account)
  ledgerEntries!: LedgerEntry[];
}
