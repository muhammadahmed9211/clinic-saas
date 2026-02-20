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

@Entity('mobile_devices')
export class MobileDeviceMicroserviceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: true })
  @Index()
  userId: number;

  @Column({ name: 'device_token', unique: true })
  @Index()
  deviceToken: string;

  @Column({ name: 'app_os', nullable: true })
  appOs: string;

  @Column({ nullable: true })
  locale: string;

  @Column({ name: 'is_registered', default: false })
  isRegistered: boolean;

  @Column({ name: 'client_id', nullable: true })
  @Index()
  clientId: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'last_app_open_time', type: 'datetimeoffset', nullable: true })
  lastAppOpenTime: Date;

  @Column({ name: 'first_seen_time', type: 'datetimeoffset', nullable: true })
  firstSeenTime: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetimeoffset' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetimeoffset' })
  updatedAt: Date;
}
