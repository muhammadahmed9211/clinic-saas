/**
 * Schema-only entity for table used by crm-cron-microservice.
 * Not used by rest-api business logic; present so schema:log / migration:generate do not suggest dropping this table.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('chat_message')
export class ChatMessageMicroserviceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar' })
  message: string;

  @Column()
  senderId: number;

  @Column()
  roomId: number;

  @Column({ default: false })
  isSeen: boolean;

  @Column({ type: 'datetime', nullable: true })
  seenAt: Date;

  @Column({ default: false })
  isDelivered: boolean;

  @Column({ type: 'datetime' })
  deliveredAt: Date;

  @Column({ type: 'varchar', default: 'text' })
  type: string;

  @Column({ nullable: true })
  attachmentId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
