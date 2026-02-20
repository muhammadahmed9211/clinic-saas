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

@Entity('user_channel_preferences')
export class UserChannelPreferenceMicroserviceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', unique: true })
  @Index()
  userId: number;

  @Column({ name: 'push_enabled', default: true })
  pushEnabled: boolean;

  @Column({ name: 'email_enabled', default: true })
  emailEnabled: boolean;

  @Column({ name: 'whatsapp_enabled', default: false })
  whatsappEnabled: boolean;

  @Column({ name: 'sms_enabled', default: false })
  smsEnabled: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetimeoffset' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetimeoffset' })
  updatedAt: Date;
}
