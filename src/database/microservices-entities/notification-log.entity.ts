/**
 * Schema-only entity for table used by crm-notification-orchestrator-microservice.
 * Not used by rest-api business logic; present so schema:log / migration:generate do not suggest dropping this table.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('notification_logs')
export class NotificationLogMicroserviceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  @Index()
  userId: number;

  @Column({ name: 'client_id', nullable: true })
  clientId: string;

  @Column({ name: 'event_type' })
  @Index()
  eventType: string;

  @Column({ name: 'event_id', nullable: true })
  eventId: string;

  @Column()
  source: string;

  @Column({ type: 'varchar', length: 20 })
  @Index()
  channel: string;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({ name: 'message_id', nullable: true })
  messageId: string;

  @Column({ type: 'nvarchar', nullable: true })
  error: string;

  @Column({ type: 'nvarchar', nullable: true })
  metadata: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetimeoffset' })
  @Index()
  createdAt: Date;
}
