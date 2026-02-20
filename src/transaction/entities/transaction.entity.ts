import { User } from 'src/users/entities/user.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import {
  Index,
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { WithdrawRequest } from './withdraw-request.entity';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { PSP } from './psp.entity';
import { TransactionMethod } from './transaction-method.entity';
import { Desk } from 'src/admin/custom-dropdown/custom-dropdown/entities/desk.entity';
import { BankDetail } from 'src/bank-details/entities/bank-detail.entity';
import { BankAccount } from 'src/admin/bank-account/entities/bank-account.entity';
import { UserCreditCard } from 'src/user-credit-cards/entities/user-credit-card.entity';
import { UserEWallet } from 'src/user-ewallet/entities/user-ewallet.entity';
import { Exchange } from './exchange.entity';
import { Exclude } from 'class-transformer';
import { Partner } from 'src/settings/entities/partner.entity';
import { Office } from 'src/admin/custom-dropdown/custom-dropdown/entities/office.entity';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  CREDIT_IN = 'CREDIT_IN',
  CREDIT_OUT = 'CREDIT_OUT',
  BONUS_IN = 'BONUS_IN',
  BONUS_OUT = 'BONUS_OUT',
  FEE = 'FEE',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum TransactionStatus {
  INITIALIZED_NOT_PAID = 'Initialized Not Paid',

  APPROVED = 'APPROVED',

  FAILED = 'FAILED',
  REJECTED = 'REJECTED',
  NOT_PAID = 'NOT_PAID',

  IDLE = 'IDLE',
  NEW = 'NEW',
  INITIALIZED = 'INITIALIZED',

  RECEIVED = 'RECEIVED',
  PENDING = 'PENDING',

  PROCESSED = 'PROCESSED',
  APPROVED_ON_HOLD = 'APPROVED_ON_HOLD',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum TransactionWorkflowStatus {
  NEW = 'NEW',
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  CLOSED_BY_CLIENT = 'CLOSED_BY_CLIENT',
  AWAITING_AGENT = 'AWAITING_AGENT',
  AWAITING_CLIENT = 'AWAITING_CLIENT',
}

export enum TransactionPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum TransactionAuthenticationAlert {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum RequestVia {
  ADMIN_AREA = 'ADMIN_AREA',
  CLIENT_AREA = 'CLIENT_AREA',
  SYSTEM = 'SYSTEM'
}

export enum AccountType {
  MT5 = 'MT5',
  WALLET = 'WALLET',
}

export enum AdjustmentType {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'float', nullable: true })
  paidAmount: number;

  @Column({ type: 'float', nullable: true })
  netAmount: number; // = paidAmount - fee

  @Column({ type: 'float', default: 0 })
  fee: number;

  @Exclude()
  @Column({ type: 'varchar', length: 50, select: false })
  hash: string;

  @Column({ type: 'varchar', length: 100 })
  currency: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pspTransactionId: string;

  //Trading Account Balance
  @Column({ type: 'float', nullable: true })
  tradingPlatformBalance: number;

  @Column({ type: 'simple-enum', enum: TransactionType })
  type: TransactionType;

  @Index()
  @ManyToOne(() => Wallet, { eager: true })
  wallet: Wallet;

  @Index()
  @ManyToOne(() => Mt5Account, { eager: true, nullable: true })
  mt5Account: Mt5Account;

  @Index()
  @ManyToOne(() => TransactionMethod, { eager: true, nullable: false })
  method: TransactionMethod;

  @Column({ type: 'simple-enum', enum: TransactionStatus })
  status: TransactionStatus;

  //For E_WALLET METHOD PAYMENT
  @Index()
  @ManyToOne(() => UserEWallet, { nullable: true })
  eWallet: UserEWallet;

  //For CREDIT_CARD METHOD PAYMENT
  @Index()
  @ManyToOne(() => UserCreditCard, { nullable: true })
  creditCardDetails: UserCreditCard;

  //For EXCHANGE METHOD PAYMENT
  @Index()
  @ManyToOne(() => Exchange, { nullable: true })
  exchangeDetails: Exchange;

  //For WIRE METHOD PAYMENT // Company Bank
  @Index()
  @ManyToOne(() => BankAccount, { nullable: true })
  companyBank: BankAccount;

  //For WIRE METHOD PAYMENT // User Bank
  @Index()
  @ManyToOne(() => BankDetail, { nullable: true })
  userBank: BankDetail;

  //For CRYPTO METHOD PAYMENT // User Bank
  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
  })
  cryptoHashReference: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
  })
  cryptoClientWalletAddress: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
  })
  cryptoCoinName: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
  })
  companyWalletAddress: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
  })
  network: string;

  @Column({ type: 'float', nullable: true })
  paidCryptoCoin: number;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
  })
  pspAccountNo: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
  })
  brokerExternalId: string;

  @Index()
  @ManyToOne(() => User, { nullable: true })
  kycRep: User;

  @Column({ nullable: true })
  reconcile: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentClientName: string;

  @Column({
    default: TransactionAuthenticationAlert.MEDIUM,
  })
  authenticationAlert: string;

  @Column({ nullable: true })
  tradingPlatformId: string;

  @Index()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Index()
  @ManyToOne(() => PSP, { eager: true, nullable: false })
  psp: PSP;

  //Withdraw Request
  @Index()
  @ManyToOne(() => WithdrawRequest, { eager: true, nullable: true })
  withdrawRequest: WithdrawRequest;

  @Column({ default: false })
  isManual: boolean;

  @Column({ type: 'uuid', nullable: true })
  relatedTransactionId: string;

  @Index()
  @ManyToOne(() => Transaction, (transaction) => transaction.bonuses, {
    nullable: true,
  })
  @JoinColumn({ name: 'relatedTransactionId' })
  relatedTransaction: Transaction;

  @OneToMany(() => Transaction, (transaction) => transaction.relatedTransaction)
  bonuses: Transaction[];

  @Index()
  @ManyToOne(() => User, { nullable: true, eager: true })
  actionBy: User;

  @Index()
  @ManyToOne(() => User, { nullable: true, eager: true })
  initiatedBy: User;

  @Index()
  @OneToOne(() => FileEntity, {
    nullable: true,
  })
  @JoinColumn()
  evidence: FileEntity;

  // Just business informative keys

  @Column({
    type: 'simple-enum',
    enum: TransactionWorkflowStatus,
    default: TransactionWorkflowStatus.NEW,
  })
  workflowStatus: TransactionWorkflowStatus;

  @Column({
    type: 'simple-enum',
    enum: TransactionPriority,
    default: TransactionPriority.MEDIUM,
  })
  priority: TransactionPriority;

  @Column({ type: 'varchar', nullable: true })
  externalTransactionId: string;

  @Column({ type: 'varchar', nullable: true })
  commentForUser: string;

  @Column({
    type: 'nvarchar',
    length: 255,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
    nullable: true,
  })
  externalNote: string;

  @Column({
    type: 'nvarchar',
    length: 255,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
    nullable: true,
  })
  clientRemarks: string;

  @Column({ type: 'varchar', nullable: true })
  internalComment: string;

  @Column({ type: 'varchar', nullable: true })
  lastStatus: string;

  @Column({ type: 'varchar', default: 'NONE' })
  kycStatus: string;

  @Column({ type: 'varchar', nullable: true })
  internalDeclineReason: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  internalNote: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transactionNote: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  internalReferenceNo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  leadSource: string;

  @Column({ nullable: true })
  officeId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  officeName: string;

  @Index()
  @ManyToOne(() => Office, { nullable: true })
  @JoinColumn({ name: 'officeId' })
  office: Office;

  @Column({ nullable: true })
  partnerId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  partnerName: string;

  @Index()
  @ManyToOne(() => Partner, { nullable: true })
  @JoinColumn({ name: 'partnerId' })
  partner: Partner;

  @Column({ nullable: true })
  salesDeskId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  salesDeskName: string;

  @Index()
  @ManyToOne(() => Desk, { nullable: true })
  @JoinColumn({ name: 'salesDeskId' })
  salesDesk: Desk;

  @Column({ nullable: true })
  retentionDeskId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  retentionDeskName: string;

  @Index()
  @ManyToOne(() => Desk, { nullable: true })
  @JoinColumn({ name: 'retentionDeskId' })
  retentionDesk: Desk;

  @Column({ nullable: true })
  salesRepId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  salesRepName: string;

  @Index()
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'salesRepId' })
  salesRep: User;

  @Column({ nullable: true })
  retentionRepId: number;

  @Index()
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'retentionRepId' })
  retentionRep: User;

  @Column({ type: 'varchar', length: 255, nullable: true })
  retentionRepName: string;

  @Column({ nullable: true })
  salesManagerId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  salesManagerName: string;

  @Index()
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'salesManagerId' })
  salesManager: User;

  @Column({ nullable: true })
  retentionManagerId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  retentionManagerName: string;

  @Index()
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'retentionManagerId' })
  retentionManager: User;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  // No idea what these key's are for

  @Column({ type: 'varchar', length: 15, nullable: true })
  pspNameManual: string;

  @Column({ type: 'varchar', nullable: true })
  acquisitionStatus: string;

  @Column({ type: 'varchar', nullable: true })
  requestVia: string;

  @Column({ type: 'float', nullable: true })
  creditBonus: number;

  @Column({ type: 'float', nullable: true })
  balanceBonus: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  binType: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subPspName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subPspTransactionId: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  indexName: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  subIndexName: string;

  @Column({ type: 'bigint', nullable: true })
  normalizedAmount: number;

  @Column({ type: 'bigint', nullable: true })
  normalizedFee: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ip: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  requestId: string;

  @Column({ default: false })
  is3dSecure: boolean;

  @Column({ default: false })
  isTest: boolean;

  @Column({ default: false })
  isResumable: boolean;

  @Column({ type: 'nvarchar', length: 'max', nullable: true })
  request: string;

  @Column({ type: 'nvarchar', length: 'max', nullable: true })
  response: string;

  @Column({ type: 'nvarchar', length: 'max', nullable: true })
  reason: string;

  @Column({ type: 'datetime', nullable: true })
  responseTime: Date;

  @Column({ default: false })
  isFtd: boolean;

  @Column({ type: 'datetime', nullable: true })
  decisionTime: Date;

  @Column({ type: 'int', nullable: true })
  parentRequestId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ownerExternalId: string;

  @Column({ type: 'bigint', nullable: true })
  externalAmount: number;

  @Column({ type: 'int', nullable: true })
  externalCurrency: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  requestIdType: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  subPspPaymentMethod: string;

  @Column({ type: 'varchar', nullable: true })
  referenceKey: string;

  @Column({ type: 'varchar', nullable: true })
  referenceKeyName: string;

  //TODO : Remove these keys as card details will be coming through user-credit-card table
  @Column({ type: 'varchar', length: 255, nullable: true })
  cardIssuer: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cardExpirationMonth: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cardExpirationYear: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cardHolderName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cardType: string;

  //DB KEYS TO MAP DATA FROM OLD CRM
  @Column({ type: 'varchar', length: 255, nullable: true })
  customParam1: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customParam2: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customParam3: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customParam4: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customParam5: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customParam6: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customParam7: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customParam8: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customParam9: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customParam10: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customParam11: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customParam12: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customParam13: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customParam14: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customParam15: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customParam16: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customParam17: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customParam18: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customParam19: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customParam20: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transferFrom: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transferTo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ticket: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  adjustmentType: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  adjustmentAccountType: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  accountType: string;

  @Column({ default: true })
  isClientVisible: boolean;

  @Column({ default: false })
  isTransferToRetention: boolean;

  @Column({ default: false })
  isTradingAccountAutoDeposit: boolean;

  @Column({ default: false })
  isBonusApplicable: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bonusCode: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tradingAccountRef: string;

  @Column({ default:false })
  isNewTradingAccount:boolean
}
