import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { ChatConversation } from './chat-conversation.entity';

/**
 * ChatMessage Entity - Mensajes dentro de conversaciones
 * Soporta múltiples tipos de contenido (text, file, etc.)
 */
@Entity('chat_messages')
@Index(['conversationId', 'createdAt'])
@Index(['senderId'])
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  conversationId!: string;

  @Column('uuid')
  senderId!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'varchar', length: 50, default: 'text' })
  contentType!: string; // text, file, image, etc.

  @Column({ type: 'jsonb', nullable: true })
  attachments!: Array<{
    url: string;
    type: string;
    size?: number;
  }>;

  @Column({ type: 'boolean', default: false })
  isEdited!: boolean;

  @Column({ type: 'boolean', default: false })
  isDeleted!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  editedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  readAt!: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;

  // Relations
  @ManyToOne(() => ChatConversation, conversation => conversation.messages, {
    onDelete: 'CASCADE',
  })
  conversation!: ChatConversation;
}
