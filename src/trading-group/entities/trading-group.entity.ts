import { Classification } from 'src/classification/entities/classification.entity';
import { Server } from 'src/wallet/entities/server.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TradingGroupType {
  NORMAL = 'NORMAL',
  COPY_TRADING = 'COPY_TRADING',
  AGENT = 'AGENT'
}

@Entity()
export class TradingGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ default: null })
  description: string;

  @Column()
  classificationId: number;

  @ManyToOne(() => Classification)
  @JoinColumn({ name: 'classificationId' })
  classification: Classification;

  @ManyToOne(() => Server, (server) => server.tradingGroup)
  server: Server;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
