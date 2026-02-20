import { AggregatorPSP } from 'src/aggregator/entities/aggregator.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PspRegulations } from './psp-regulations.entity';
import { BankAccount } from 'src/admin/bank-account/entities/bank-account.entity';
import { Exchange } from './exchange.entity';
import { PspCountries } from 'src/psp/entities/psp-countries.entity';
import { PspMethod } from 'src/psp/entities/psp-method.entity';

export enum PspNames {
  BridgerPay = 'BridgerPay',
  BankTransfer = 'BankTransfer',
  CryptoDeposit = 'CryptoDeposit',
  NONE = 'NONE',
  DPO = 'DPO',
  TELR = 'Telr',
  N_GENIUS = 'N_GENIUS',
  EPay = 'EPay',
  Praxis = 'Praxis',
  MyFatoorah = 'MyFatoorah',
  AlphaPay = 'AlphaPay',
  JENAPAY="JenaPay",

}

export enum PspDisplayName {
  BridgerPay = 'Bridger Pay',
  BankTransfer = 'Bank Transfer',
  CryptoDeposit = 'Crypto Deposit',
  NONE = 'NONE',
  DPO = 'DPO',
  TELR = 'Telr',
  N_GENIUS = 'N_GENIUS',
  EPay = 'EPay',
}

export enum RestrictionType {
  Include = 'Include',
  Exclude = 'Exclude'
}

@Entity()
export class PSP {
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

  @Column({ default: false })
  isOperational: boolean;

  @ManyToOne(() => AggregatorPSP, { nullable: true })
  aggregator: AggregatorPSP;

  @Column({ type: 'nvarchar', nullable: true })
  aggregatorName: string;

  @Column({ type: 'nvarchar', default: 'ALL' })
  type: string;

  @Column({ type: 'nvarchar', default: 'AMOUNT' })
  depositFeeType: string;

  @Column({ type: 'float', default: 0 })
  depositFee: number;

  @Column({ type: 'nvarchar', default: 'AMOUNT' })
  depositCommissionType: string;

  @Column({ type: 'float', default: 0 })
  depositCommission: number;

  @Column({ type: 'nvarchar', default: 'AMOUNT' })
  withdrawalCommissionType: string;

  @Column({ type: 'float', default: 0 })
  withdrawalCommission: number;

  @Column({ type: 'nvarchar', default: 'AMOUNT' })
  withdrawalFeeType: string;

  @Column({ type: 'float', default: 0 })
  withdrawalFee: number;

  @Column({ type: 'nvarchar', default: 'AMOUNT' })
  clientDepositFeeType: string;

  @Column({ type: 'float', default: 0 })
  clientDepositFee: number;

  @Column({ type: 'nvarchar', default: 'AMOUNT' })
  clientWithdrawalFeeType: string;

  @Column({ type: 'float', default: 0 })
  clientWithdrawalFee: number;

  @Column({ type: 'float', default: 0 })
  depositLimit: number;

  @Column({ type: 'float', default: 0 })
  withdrawalLimit: number;

  @Column({ type: 'nvarchar', default: 'PERCENTAGE' })
  rolloverType: string;

  @Column({ type: 'float', default: 0 })
  rollover: number;

  @Column({ type: 'float', default: 1 })
  minDeposit: number;

  @Column({ type: 'float', default: 1000000 })
  maxDeposit: number;

  @Column({ default: false })
  isCountryRestricted: boolean;

  @Column({ type: 'nvarchar', default: RestrictionType.Include })
  countryRestrictionType: string;

  @Column({ default: false })
  isRegulationRestricted: boolean;

  @Column({ type: 'nvarchar', default: RestrictionType.Include })
  regulationRestrictionType: string;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @ManyToOne(() => Exchange, { nullable: true })
  exchange: Exchange;

  @ManyToOne(() => BankAccount, { nullable: true })
  bankAccount: BankAccount;

  @OneToMany(() => PspRegulations, (regulations) => regulations.psp)
  regulations: PspRegulations[];

  @OneToMany(() => PspCountries, (pspCountries) => pspCountries.psp)
  countries: PspCountries[];

  @OneToMany(() => PspMethod, (pspMethod) => pspMethod.psp)
  methods: PspMethod[];

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
