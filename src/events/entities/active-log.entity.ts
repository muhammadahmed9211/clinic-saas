import { EntityHelper } from 'src/utils/entity-helper';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ActivityLog extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  action: number;

  @Column({ type: 'bigint', nullable: true })
  entity_id: number;

  @Column({ type: 'int', nullable: true })
  entity_type: number;

  @Column({
    type: 'nvarchar',
    length: 'MAX',
    nullable: true,
  })
  json_object: string;

  @Column({ type: 'bigint', nullable: false })
  performer_id: number;

  @Column({ type: 'int' })
  performer_type: number;

  @Column({ type: 'bigint', nullable: true })
  parent_id: number;

  @Column({ type: 'int', nullable: true })
  parent_type: number;

  @Column({ type: 'datetime', nullable: true })
  archive_insertion_date: Date;

  @Column({ type: 'tinyint', nullable: false })
  is_from_archive: number;

  @Column({ type: 'int', nullable: false })
  trigger_type: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
