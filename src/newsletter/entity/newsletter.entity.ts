// entity

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from '../../utils/entity-helper';

@Entity()
export class newsletter_subscriptions extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ default: true })
  tc_accepted: boolean;

  @Column({ nullable: true, type: 'text' })
  subscriptions: string;

  @Column({ default: true })
  isVerified: boolean;

  @Column({ nullable: true })
  hash: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
