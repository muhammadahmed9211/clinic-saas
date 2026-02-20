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
  Unique,
} from 'typeorm';

@Entity('event_channel_mappings')
@Unique(['eventType', 'channel'])
export class EventChannelMappingMicroserviceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  @Index()
  eventType: string;

  @Column({ type: 'varchar', length: 20 })
  @Index()
  channel: string;

  @Column({ type: 'bit', default: true })
  @Index()
  isActive: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  templateCode: string;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @CreateDateColumn({ type: 'datetimeoffset', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetimeoffset', name: 'updated_at' })
  updatedAt: Date;
}
