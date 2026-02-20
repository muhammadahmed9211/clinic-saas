import {
  Entity,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Operator } from './operator.entity';
import { Desk } from './desk.entity';

@Entity()
@Unique(['operator', 'desk'])
export class OperatorDeskRel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Operator, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'operator_id' })
  operator: Operator;

  @ManyToOne(() => Desk, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'desk_id' })
  desk: Desk;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
