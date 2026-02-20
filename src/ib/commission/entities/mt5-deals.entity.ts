import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { IbCommissionDeals } from './ib-comission-deals.entity';

@Entity('mt5_deals')
export class Mt5Deal {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Index('PK_mt5_deals', { unique: true })
  @Column({
    name: 'Deal',
    type: 'decimal',
    precision: 20,
    scale: 0,
    nullable: true,
  })
  deal: number;

  @Index('IDX_mt5_deals_Timestamp')
  @Column({ name: 'Timestamp', type: 'bigint', nullable: true })
  timestamp: string;

  @Column({ name: 'ExternalID', type: 'nvarchar', length: 32, nullable: true })
  externalId: string;

  @Column({
    name: 'Login',
    type: 'decimal',
    precision: 20,
    scale: 0,
    nullable: true,
  })
  login: number;

  @Column({
    name: 'Dealer',
    type: 'decimal',
    precision: 20,
    scale: 0,
    nullable: true,
  })
  dealer: number;

  @Column({
    name: 'Order',
    type: 'decimal',
    precision: 20,
    scale: 0,
    nullable: true,
  })
  order: number;

  @Column({
    name: 'Action',
    type: 'decimal',
    precision: 11,
    scale: 0,
    nullable: true,
  })
  action: number;

  @Column({
    name: 'Entry',
    type: 'decimal',
    precision: 11,
    scale: 0,
    nullable: true,
  })
  entry: number;

  @Column({
    name: 'Reason',
    type: 'decimal',
    precision: 11,
    scale: 0,
    nullable: true,
  })
  reason: number;

  @Column({
    name: 'Digits',
    type: 'decimal',
    precision: 11,
    scale: 0,
    nullable: true,
  })
  digits: number;

  @Column({
    name: 'DigitsCurrency',
    type: 'decimal',
    precision: 11,
    scale: 0,
    nullable: true,
  })
  digitsCurrency: number;

  @Column({ name: 'ContractSize', type: 'float', nullable: true })
  contractSize: number;

  @Column({ name: 'Time', type: 'datetime2', nullable: true })
  time: Date;

  @Column({ name: 'TimeMsc', type: 'datetime2', nullable: true })
  timeMsc: Date;

  @Column({ name: 'Symbol', type: 'nvarchar', length: 32, nullable: true })
  symbol: string;

  @Column({ name: 'Price', type: 'float', nullable: true })
  price: number;

  @Column({
    name: 'VolumeExt',
    type: 'decimal',
    precision: 20,
    scale: 0,
    nullable: true,
  })
  volumeExt: number;

  @Column({ name: 'Profit', type: 'float', nullable: true })
  profit: number;

  @Column({ name: 'Storage', type: 'float', nullable: true })
  storage: number;

  @Column({ name: 'Commission', type: 'float', nullable: true })
  commission: number;

  @Column({ name: 'Fee', type: 'float', nullable: true })
  fee: number;

  @Column({ name: 'RateProfit', type: 'float', nullable: true })
  rateProfit: number;

  @Column({ name: 'RateMargin', type: 'float', nullable: true })
  rateMargin: number;

  @Column({
    name: 'ExpertID',
    type: 'decimal',
    precision: 20,
    scale: 0,
    nullable: true,
  })
  expertId: number;

  @Column({
    name: 'PositionID',
    type: 'decimal',
    precision: 20,
    scale: 0,
    nullable: true,
  })
  positionId: number;

  @Column({ name: 'Comment', type: 'nvarchar', length: 32, nullable: true })
  comment: string;

  @Column({ name: 'ProfitRaw', type: 'float', nullable: true })
  profitRaw: number;

  @Column({ name: 'PricePosition', type: 'float', nullable: true })
  pricePosition: number;

  @Column({ name: 'PriceSL', type: 'float', nullable: true })
  priceSl: number;

  @Column({ name: 'PriceTP', type: 'float', nullable: true })
  priceTp: number;

  @Column({
    name: 'VolumeClosedExt',
    type: 'decimal',
    precision: 20,
    scale: 0,
    nullable: true,
  })
  volumeClosedExt: number;

  @Column({ name: 'TickValue', type: 'float', nullable: true })
  tickValue: number;

  @Column({ name: 'TickSize', type: 'float', nullable: true })
  tickSize: number;

  @Column({
    name: 'Flags',
    type: 'decimal',
    precision: 20,
    scale: 0,
    nullable: true,
  })
  flags: number;

  @Column({ name: 'Value', type: 'float', nullable: true })
  value: number;

  @Column({ name: 'Gateway', type: 'nvarchar', length: 16, nullable: true })
  gateway: string;

  @Column({ name: 'PriceGateway', type: 'float', nullable: true })
  priceGateway: number;

  @Column({
    name: 'ModifyFlags',
    type: 'decimal',
    precision: 11,
    scale: 0,
    nullable: true,
  })
  modifyFlags: number;

  @Column({ name: 'MarketBid', type: 'float', nullable: true })
  marketBid: number;

  @Column({ name: 'MarketAsk', type: 'float', nullable: true })
  marketAsk: number;

  @Column({ name: 'MarketLast', type: 'float', nullable: true })
  marketLast: number;

  @Column({
    name: 'Volume',
    type: 'decimal',
    precision: 20,
    scale: 0,
    nullable: true,
  })
  volume: number;

  @Column({
    name: 'VolumeClosed',
    type: 'decimal',
    precision: 20,
    scale: 0,
    nullable: true,
  })
  volumeClosed: number;

  @Column({ name: 'ApiData', type: 'nvarchar', length: 4000, nullable: true })
  apiData: string;

  @CreateDateColumn({
    name: 'createdAt',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ name: 'SalesRepId', type: 'bigint', nullable: true })
  salesRepId: number;

  @ManyToOne(() => Operator)
  @JoinColumn({ name: 'SalesRepId' })
  salesRep: Operator;

  @Column({ name: 'SalesManagerId', type: 'bigint', nullable: true })
  salesManagerId: number;

  @ManyToOne(() => Operator)
  @JoinColumn({ name: 'SalesManagerId' })
  salesManager: Operator;

  @Column({ name: 'RetentionRepId', type: 'bigint', nullable: true })
  retentionRepId: number;

  @ManyToOne(() => Operator)
  @JoinColumn({ name: 'RetentionRepId' })
  retentionRep: Operator;

  @Column({ name: 'RetentionManagerId', type: 'bigint', nullable: true })
  retentionManagerId: number;

  @ManyToOne(() => Operator)
  @JoinColumn({ name: 'RetentionManagerId' })
  retentionManager: Operator;
}
