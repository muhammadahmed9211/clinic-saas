/**
 * Schema-only entity for table used by crm-notification-orchestrator-microservice.
 * Not used by rest-api business logic; present so schema:log / migration:generate do not suggest dropping this table.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('notification_templates')
export class NotificationTemplateMicroserviceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  code: string;

  @Column({ type: 'varchar', length: 20 })
  channel: string;

  @Column()
  locale: string;

  @Column()
  title: string;

  @Column({ type: 'nvarchar' })
  body: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetimeoffset' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetimeoffset' })
  updatedAt: Date;
}
