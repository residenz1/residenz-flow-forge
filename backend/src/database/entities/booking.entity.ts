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

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED',
}

export enum BookingFrequency {
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  ONE_TIME = 'ONE_TIME',
}

/**
 * Booking Entity - Servicios de limpieza reservados
 * Lifecycle: PENDING → CONFIRMED → IN_PROGRESS → COMPLETED
 */
@Entity('bookings')
@Index(['clientId', 'status'])
@Index(['resiId', 'status'])
@Index(['scheduledAt', 'status'])
@Index(['createdAt'])
@Check(`"status" IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED')`)
@Check(`"frequency" IN ('WEEKLY', 'BIWEEKLY', 'MONTHLY', 'ONE_TIME')`)
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  clientId!: string;

  @Column('uuid', { nullable: true })
  resiId!: string;

  @Column('uuid')
  addressId!: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status!: BookingStatus;

  @Column({
    type: 'enum',
    enum: BookingFrequency,
    default: BookingFrequency.ONE_TIME,
  })
  frequency!: BookingFrequency;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  agreedPayout!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  clientPrice!: number;

  @Column({ type: 'timestamp' })
  scheduledAt!: Date;

  @Column({ type: 'int', nullable: true })
  estimatedDurationMinutes!: number;

  @Column({ type: 'timestamp', nullable: true })
  checkInAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  checkOutAt!: Date;

  @Column('uuid', { nullable: true })
  escrowAccountId!: string;

  @Column('uuid', { nullable: true })
  payoutTransactionId!: string;

  @Column({ type: 'text', nullable: true })
  specialInstructions!: string;

  @Column({ type: 'float', nullable: true })
  resiRating!: number;

  @Column({ type: 'text', nullable: true })
  resiReview!: string;

  @Column({ type: 'float', nullable: true })
  clientRating!: number;

  @Column({ type: 'text', nullable: true })
  clientReview!: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => User, user => user.clientBookings, { onDelete: 'CASCADE' })
  client!: User;

  @ManyToOne(() => User, user => user.resiBookings, { nullable: true })
  resi!: User;

  @OneToMany(() => Transaction, transaction => transaction.booking)
  transactions!: Transaction[];
}
