import { TradingGroup } from 'src/trading-group/entities/trading-group.entity';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Entity,
  OneToMany,
} from 'typeorm';

export enum ServerName {
  WALLET = 'WALLET',
  DEMO = 'DEMO',
  LIVE = 'LIVE',
  DEV = 'DEV',
}

export enum ServerType {
  SYSTEM = 'SYSTEM',
  MT5 = 'MT5',
}

@Entity()
export class Server {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'simple-enum', enum: ServerName })
  name: ServerName;

  @Column({ type: 'simple-enum', enum: ServerType })
  type: ServerType;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => TradingGroup, (tradingGroup) => tradingGroup.server)
  tradingGroup: TradingGroup;
}
