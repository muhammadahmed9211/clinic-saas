import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum FunnelType {
  SALES = 'sales',
  LEAD = 'lead',
}
@Entity()
export class Funnel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sequence: number;

  @Column()
  name: string;

  @Column()
  probability: number;

  @Column({ default: FunnelType.LEAD })
  type: FunnelType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
