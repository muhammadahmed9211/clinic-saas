import { EntityHelper } from 'src/utils/entity-helper';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserLog extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 'MAX' })
  leftValue: string;

  @Column({ length: 'MAX' })
  rightValue: string;

  @Column()
  field: string;

  @BeforeInsert()
  @BeforeUpdate()
  setEntityId() {
    this.entity_id = this.entity_id.toString();
  }

  @Column()
  entity_id: string;

  @Column()
  entity_type: number;

  @Column()
  performer_id: number;

  @Column()
  performer_type: number;

  @Column()
  parent_id: string;

  @Column()
  parent_type: number;

  @Column()
  trigger_type: string;

  @Column()
  action: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
