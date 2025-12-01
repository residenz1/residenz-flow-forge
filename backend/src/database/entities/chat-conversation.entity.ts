import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { ChatMessage } from './chat-message.entity';

/**
 * ChatConversation Entity - Conversaciones entre usuarios
 * Puede ser: Cliente ↔ Resi, Cliente ↔ Support, Resi ↔ Support
 */
@Entity('chat_conversations')
@Index(['user1Id', 'user2Id'])
@Index(['createdAt'])
@Index(['updatedAt'])
export class ChatConversation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  user1Id!: string;

  @Column('uuid')
  user2Id!: string;

  @Column('uuid', { nullable: true })
  bookingId!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  type!: string; // 'booking', 'support', 'general'

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'int', default: 0 })
  unreadMessagesUser1!: number;

  @Column({ type: 'int', default: 0 })
  unreadMessagesUser2!: number;

  @Column({ type: 'timestamp', nullable: true })
  lastMessageAt!: Date;

  @Column({ type: 'text', nullable: true })
  lastMessagePreview!: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => User, user => user.conversations1, { onDelete: 'CASCADE' })
  user1!: User;

  @ManyToOne(() => User, user => user.conversations2, { onDelete: 'CASCADE' })
  user2!: User;

  @OneToMany(() => ChatMessage, message => message.conversation)
  messages!: ChatMessage[];
}
