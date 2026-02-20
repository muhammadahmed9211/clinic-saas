import { Communication } from 'src/admin/client/entities/communication.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { EmailEntity } from './email-entity.entity';
import { EmailMapping } from 'src/admin/email-mapping/entity/email-mapping.entity';

@Entity()
@Unique(['name', 'language', 'domain','deletedAt','isDeleted'])
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  communicationType: number;

  @Column()
  eventId: number;

  @Column({ length: 255 })
  indexName: string;

  @Column({ length: 255 })
  language: string;

  @Column({ length: 255 })
  subIndexName: string;

  @Column({ type: 'nvarchar', length: 'MAX' })
  text: string;

  @Column({ type: 'nvarchar', length: 'MAX' })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  eventName: string | null;

  @Column({ length: 255, nullable: true, type: 'nvarchar' })
  subject: string | null;

  @Column({ nullable: true, type: 'nvarchar' })
  domain: string;

  @Column({ type: 'nvarchar', default: 'v1'})
  version: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ length: 255 })
  trackingId: string;

  @OneToMany(() => Communication, (communication) => communication.template)
  communications: Communication[];
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  creationTime: Date;

  @Column({
    type: 'datetime2',
    precision: 6,
    default: () => 'SYSUTCDATETIME()',
    onUpdate: 'SYSUTCDATETIME()',
  })
  lastUpdateTime: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => EmailEntity, (entity) => entity.templates, {nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'entityId', referencedColumnName: 'id' })
  entity: EmailEntity;

  @OneToMany(
    () => EmailMapping,
    (emailMapping) => emailMapping.bodyContent,
  )
  emailMapping: EmailMapping;
}
