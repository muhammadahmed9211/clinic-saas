import {
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';
import { EntityHelper } from '../../utils/entity-helper';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';

@Entity()
export class OperatorSession extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Operator, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @Index()
  operator: Operator;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
