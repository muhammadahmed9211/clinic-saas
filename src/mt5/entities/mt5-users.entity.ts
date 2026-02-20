import { Server } from 'src/wallet/entities/server.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('IDX_mt5_users_replicated_replicated_Timestamp', ['timestamp'], {})
@Index('PK_mt5_users_replicated', ['login'], { unique: true })
@Entity('mt5_users_replicated', { schema: 'dbo' })
export class Mt5UsersReplicated {
  @PrimaryGeneratedColumn()
  recordId: number;

  @Column({ unique: true })
  login: string;

  @Column('bigint', { name: 'Timestamp', default: () => '(0)' })
  timestamp: string;

  @Column('nvarchar', { name: 'Group', length: 64, default: () => "''" })
  group: string;

  @Column('numeric', {
    name: 'CertSerialNumber',
    precision: 20,
    scale: 0,
    default: () => '(0)',
  })
  certSerialNumber: number;

  @Column('numeric', {
    name: 'Rights',
    precision: 20,
    scale: 0,
    default: () => '(0)',
  })
  rights: number;

  @Column('datetime', { name: 'Registration', default: () => 'GETDATE()' })
  registration: Date;

  @Column('datetime', { name: 'LastAccess', default: () => 'GETDATE()' })
  lastAccess: Date;

  @Column('datetime', { name: 'LastPassChange', default: () => 'GETDATE()' })
  lastPassChange: Date;

  @Column('nvarchar', { name: 'FirstName', length: 128, default: () => "''" })
  firstName: string;

  @Column('nvarchar', { name: 'LastName', length: 64, default: () => "''" })
  lastName: string;

  @Column('nvarchar', { name: 'MiddleName', length: 64, default: () => "''" })
  middleName: string;

  @Column('nvarchar', { name: 'Company', length: 64, default: () => "''" })
  company: string;

  @Column('nvarchar', { name: 'Account', length: 32, default: () => "''" })
  account: string;

  @Column('nvarchar', { name: 'Country', length: 32, default: () => "''" })
  country: string;

  @Column('numeric', {
    name: 'Language',
    precision: 11,
    scale: 0,
    default: () => '(0)',
  })
  language: number;

  @Column('numeric', {
    name: 'ClientID',
    precision: 20,
    scale: 0,
    default: () => '(0)',
  })
  clientId: number;

  @Column('nvarchar', { name: 'City', length: 32, default: () => "''" })
  city: string;

  @Column('nvarchar', { name: 'State', length: 32, default: () => "''" })
  state: string;

  @Column('nvarchar', { name: 'ZipCode', length: 16, default: () => "''" })
  zipCode: string;

  @Column('nvarchar', { name: 'Address', length: 128, default: () => "''" })
  address: string;

  @Column('nvarchar', { name: 'Phone', length: 32, default: () => "''" })
  phone: string;

  @Column('nvarchar', { name: 'Email', length: 64, default: () => "''" })
  email: string;

  @Column('nvarchar', { name: 'ID', length: 32, default: () => "''" })
  id: string;

  @Column('nvarchar', { name: 'Status', length: 16, default: () => "''" })
  status: string;

  @Column('nvarchar', { name: 'Comment', length: 64, default: () => "''" })
  comment: string;

  @Column('numeric', {
    name: 'Color',
    precision: 11,
    scale: 0,
    default: () => '(0)',
  })
  color: number;

  @Column('nvarchar', {
    name: 'PhonePassword',
    length: 32,
    default: () => "''",
  })
  phonePassword: string;

  @Column('numeric', {
    name: 'Leverage',
    precision: 11,
    scale: 0,
    default: () => '(0)',
  })
  leverage: number;

  @Column('numeric', {
    name: 'Agent',
    precision: 20,
    scale: 0,
    default: () => '(0)',
  })
  agent: number;

  @Column('nvarchar', {
    name: 'TradeAccounts',
    length: 128,
    default: () => "''",
  })
  tradeAccounts: string;

  @Column('float', {
    name: 'LimitPositions',
    precision: 53,
    default: () => '(0.0)',
  })
  limitPositions: number;

  @Column('numeric', {
    name: 'LimitOrders',
    precision: 11,
    scale: 0,
    default: () => '(0)',
  })
  limitOrders: number;

  @Column('nvarchar', {
    name: 'LeadCampaign',
    length: 32,
    default: () => "''",
  })
  leadCampaign: string;

  @Column('nvarchar', { name: 'LeadSource', length: 32, default: () => "''" })
  leadSource: string;

  @Column('bigint', { name: 'TimestampTrade', default: () => '(0)' })
  timestampTrade: string;

  @Column('float', { name: 'Balance', precision: 53, default: () => '(0.0)' })
  balance: number;

  @Column('float', { name: 'Credit', precision: 53, default: () => '(0.0)' })
  credit: number;

  @Column('float', {
    name: 'InterestRate',
    precision: 53,
    default: () => '(0.0)',
  })
  interestRate: number;

  @Column('float', {
    name: 'CommissionDaily',
    precision: 53,
    default: () => '(0.0)',
  })
  commissionDaily: number;

  @Column('float', {
    name: 'CommissionMonthly',
    precision: 53,
    default: () => '(0.0)',
  })
  commissionMonthly: number;

  @Column('float', {
    name: 'BalancePrevDay',
    precision: 53,
    default: () => '(0.0)',
  })
  balancePrevDay: number;

  @Column('float', {
    name: 'BalancePrevMonth',
    precision: 53,
    default: () => '(0.0)',
  })
  balancePrevMonth: number;

  @Column('float', {
    name: 'EquityPrevDay',
    precision: 53,
    default: () => '(0.0)',
  })
  equityPrevDay: number;

  @Column('float', {
    name: 'EquityPrevMonth',
    precision: 53,
    default: () => '(0.0)',
  })
  equityPrevMonth: number;

  @Column('nvarchar', { name: 'Name', length: 256, default: () => "''" })
  name: string;

  @Column('nvarchar', { name: 'MQID', length: 16, default: () => "''" })
  mqid: string;

  @Column('nvarchar', { name: 'LastIP', length: 32, default: () => "''" })
  lastIp: string;

  @Column('nvarchar', { name: 'ApiData', length: 4000, default: () => "''" })
  apiData: string;

  @ManyToOne(() => Server)
  server: string;

  @CreateDateColumn({
    name: 'CreatedAt',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'UpdatedAt',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'DeletedAt', nullable: true })
  deletedAt: Date;
}
