import { Regulations } from 'src/admin/regulations/entities/regulations.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AggregatorRegulations } from './aggregator-regulations.entity';
import { PSP } from 'src/transaction/entities/psp.entity';

export enum AggregatorNames {
  LOCAL_GATEWAY='Local Gateway',
  BridgerPay = 'BridgerPay',
  Praxis = 'Praxis',
}

@Entity()
export class AggregatorPSP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar' })
  name: string;

  @Column({ type: 'nvarchar' })
  displayName: string;

  @Column({ type: 'nvarchar' })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'float' })
  fee: number;

  @OneToMany(() => AggregatorRegulations, (aggregatorRegulations)=>aggregatorRegulations.aggregator)
  regulations: AggregatorRegulations;

  @OneToMany(() => PSP, (psp)=>psp.aggregator)
  psp: PSP[];

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
