import { Regulations } from 'src/admin/regulations/entities/regulations.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { AggregatorPSP } from './aggregator.entity';

@Entity()
export class AggregatorRegulations {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Regulations)
  regulation: Regulations;

  @ManyToOne(() => AggregatorPSP)
  aggregator: AggregatorPSP;

  @Column({nullable:false})
  priority: number;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
