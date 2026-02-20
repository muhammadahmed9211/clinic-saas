import {
  BeforeInsert,
  BeforeUpdate,
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Status } from '../../statuses/entities/status.entity';
import { FileEntity } from '../../files/entities/file.entity';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { User } from './user.entity';
import { CustomStatus } from 'src/admin/client/entities/custom_status.entity';
import { Partner } from 'src/settings/entities/partner.entity';
import { AdminTask } from 'src/admin/task/entities/task.entity';
import { UserLifeCycle } from 'src/utils/enums/user-lifecycle.enum';
import { Regulations } from 'src/admin/regulations/entities/regulations.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import { IbCommissionDeals } from 'src/ib/entities/ib-commission-deals.entity';
import { IbCommissionProfile } from 'src/ib/ib_profile/entities/ib_commission_profile.entity';

export enum AccountClassification {
  STANDARD = 'Standard',
  PREMIERE = 'Premier',
  ELITE = 'Elite',
}

@Entity()
@Check(`"userLifeCycle" IN ('lead', 'registered', 'applicant', 'client')`)
export class Client {
  @PrimaryGeneratedColumn()
  userId: number;

  @BeforeInsert()
  @BeforeUpdate()
  setTel() {
    if (this.telephonePrefix && this.telephone) {
      const tel = `${this.telephonePrefix}${this.telephone}`;
      this.tel = tel;
    }
  }

  @Column({ type: 'int', nullable: true, default: null })
  @Index()
  @Expose({ groups: ['me', 'admin'] })
  clientId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int', nullable: true, default: null })
  @Index()
  @Exclude()
  walletId: number;

  @OneToOne(() => Wallet)
  @JoinColumn({ name: 'walletId' })
  wallet: Wallet;

  @ManyToOne(() => CustomStatus)
  @JoinColumn({ name: 'internalSalesStatus' })
  customSaleStatus: CustomStatus;

  @ManyToOne(() => CustomStatus)
  @JoinColumn({ name: 'internalRetentionStatus' })
  customRetentionStatus: CustomStatus;

  @ManyToOne(() => CustomStatus)
  @JoinColumn({ name: 'clientPotential' })
  customClientPotential: CustomStatus;

  @ManyToOne(() => CustomStatus)
  @JoinColumn({ name: 'auditStatus' })
  customAuditStatus: CustomStatus;

  @ManyToOne(() => CustomStatus)
  @JoinColumn({ name: 'kycStatus' })
  customKycStatus: CustomStatus;

  @Column({ nullable: true })
  @Index()
  @Expose({ groups: ['me', 'admin'] })
  firstName: string;

  @Column({ nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  lastName: string;

  @Column({ nullable: true })
  @IsOptional()
  @Expose({ groups: ['me', 'admin'] })
  groupString: string;

  @Column()
  @Index()
  @Expose({ groups: ['me', 'admin'] })
  email: string;

  @Column({ nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  telephone: string;

  @Column({ nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  telephonePrefix: string;

  @Column({ nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  tel: string;

  @Column({ nullable: true })
  @Index()
  @IsOptional()
  id2: string;

  @Column({ nullable: true })
  @IsOptional()
  fullAddress: string;

  @Column({ nullable: true })
  @IsOptional()
  poBox: string;

  @Column({ nullable: true })
  @IsOptional()
  city: string;

  @Column({ nullable: true })
  @IsOptional()
  state: string;

  @Column({ nullable: true })
  @IsOptional()
  zip: string;

  @Column({ nullable: true })
  @IsOptional()
  kycNote: string;

  @Column({ type: String, nullable: true })
  dateOfBirth: Date | null;

  @Column({ nullable: true })
  @IsOptional()
  telephoneValid: boolean;

  @Column({ nullable: true })
  affid: number;

  @ManyToOne(() => Partner, { eager: true })
  @JoinColumn({ name: 'affid' })
  partner: Partner;

  @Column({ type: 'nvarchar', nullable: true, length: 'max' })
  question2: string;

  @Column({ type: 'nvarchar', nullable: true, length: 'max' })
  agreementData: string;

  @Column({ nullable: true })
  @IsOptional()
  userSignature: string;

  @Column({ nullable: true })
  @IsOptional()
  mobile: string;

  @Column({ nullable: true })
  @IsOptional()
  questionAnswers: string;

  @Column({ nullable: true, default: true })
  @Index()
  @IsOptional()
  isActive: boolean;

  @Column({ nullable: true, type: 'text' })
  registrationNotes: string;

  @Column({ nullable: true, type: 'nvarchar', length: 'MAX' })
  p1: string;

  @Column({ nullable: true, type: 'nvarchar', length: 'MAX' })
  p2: string;

  @Column({ nullable: true, type: 'nvarchar', length: 'MAX' })
  p3: string;

  @Column({ nullable: true, type: 'nvarchar', length: 'MAX' })
  p4: string;

  @Column({ nullable: true, type: 'nvarchar', length: 'MAX' })
  p5: string;

  @Column({ nullable: true, type: 'nvarchar', length: 'MAX' })
  p6: string;

  @Column({ default: false })
  pu: boolean;

  @Column({ nullable: true, type: 'text' })
  visitId: string;

  @Column({ nullable: true, type: 'text' })
  userAgent: string;

  @Column({ nullable: true, type: 'text' })
  referral: string;

  @Column({ nullable: true, type: 'text' })
  queryString: string;

  @Column({ nullable: true, type: 'text' })
  rootExternalId: string;

  @Column({ nullable: true, type: 'text' })
  dstTimeZoneoffset: string;

  @Column({ default: false })
  isBlockEmails: boolean;

  @Column({ nullable: true, type: 'text' })
  utmSource: string;

  @Column({ nullable: true, type: 'text' })
  utmMedium: string;

  @Column({ nullable: true, type: 'text' })
  utmCampaign: string;

  @Column({ nullable: true, type: 'text' })
  campaignId: string;

  @Column({ nullable: true, type: 'text' })
  utmContent: string;

  @Column({ nullable: true, type: 'text' })
  utmTerm: string;

  @Column({ nullable: true, type: 'text' })
  referrer: string;

  @Column({ nullable: true })
  bankAccountName: string;

  @Column({ nullable: true })
  bankAccountNumber: string;

  @Column({ nullable: true })
  bankBranchName: string;

  @Column({ nullable: true })
  bankComment: string;

  @Column({ nullable: true })
  bankCountryIso: string;

  @Column({ nullable: true })
  bankName: string;

  @Column({ nullable: true })
  bankSwiftCode: string;

  @Column({ nullable: true })
  salesDeskId: number;

  @Column({ nullable: true })
  salesDesk: string;

  @Column({ nullable: true })
  officeId: number;

  @Column({ nullable: true })
  office: string;

  @Column({ nullable: true })
  salesRepId: number;

  @Column({ nullable: true })
  salesRep: string;

  @Column({ nullable: true })
  internalSalesStatus: number;

  @Column({ nullable: true })
  clientPotential: number;

  @Column({ nullable: true })
  auditStatus: number;

  @Column({ nullable: true })
  firstRetinationRep: number;

  @Column({ nullable: true })
  retentionDeskId: number;

  @Column({ nullable: true })
  retentionDesk: string;

  @Column({ nullable: true })
  retentionRepId: number;

  @Column({ nullable: true })
  retentionRep: string;

  @Column({ nullable: true })
  internalRetentionStatus: number;

  @Column({ nullable: true })
  supportDeskId: number;

  @Column({ nullable: true })
  supportDesk: string;

  @Column({ nullable: true })
  supportRepId: number;

  @Column({ nullable: true })
  supportRep: string;

  @Column({ nullable: true })
  financeDeskId: number;

  @Column({ nullable: true })
  financeDesk: string;

  @Column({ nullable: true })
  financeRepId: number;

  @Column({ nullable: true })
  financeRep: string;

  @Column({ nullable: true })
  kycDeskId: number;

  @Column({ nullable: true })
  kycDesk: string;

  @Column({ nullable: true })
  kycRepId: number;

  @Column({ nullable: true })
  kycRep: string;

  @Column({ nullable: true })
  secondApplicantFullName: string;

  @Column({ nullable: true })
  mothersName: string;

  @Column({ nullable: true })
  countryOfBirth: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  countryIso: string;

  @Column({ nullable: true })
  languageIso: string;

  @Column({ nullable: true })
  countryOfResidence: string;

  @Column({ nullable: true })
  language: string;

  @Column({ nullable: true })
  secondPrefix: string;

  @Column({ nullable: true })
  secondTelephone: string;

  @Column({ nullable: true })
  thirdPrefix: string;

  @Column({ nullable: true })
  thirdTelephone: string;

  @Column({ nullable: true })
  skype: string;

  @Column({ nullable: true })
  drivingLicenseNumber: string;

  @Column({ nullable: true })
  idPassportNumber: string;

  @Column({ nullable: true })
  ssnTinNumber: string;

  @Column({ nullable: true })
  nationality: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  countrySpecificIdentifier: string;

  @Column({ nullable: true })
  countrySpecificIdentifierType: string;

  @Column({ nullable: true })
  addressStreetName: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ nullable: true })
  houseNo: string;

  @Column({ nullable: true })
  dualCitizenship: string;

  @Column({ nullable: true })
  countryOfCitizenship: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  abuseReason: string;

  @Column({ nullable: true })
  price: string;

  @Column({ nullable: true })
  brokerName: string;

  @Column({ nullable: true })
  liquidAssets: string;

  @Column({ default: false })
  testUserMode: boolean = false;

  @Column({ default: false })
  isPhoneValid: boolean = false;

  @Column({ default: false })
  isSecondPhoneValid: boolean = false;

  @Column({ default: false })
  isEmailConfirmed: boolean = false;

  @Column({ default: false })
  isUserConverted: boolean = false;

  @Column({ default: false })
  isProTrader: boolean = false;

  @Column({ default: false })
  isShowInvestments: boolean = false;

  @Column({ default: false })
  isAutomaticTransfer: boolean = false;

  @Column({ default: false })
  isAllowTransactions: boolean = false;

  @Column({ default: false })
  isSuspiciousUser: boolean = false;

  @Column({ default: false })
  isBlockAllCommunications: boolean = false;

  @Column({ default: false })
  isBlockSendingEmails: boolean = false;

  @Column({ default: false })
  isProblematicClient: boolean = false;

  @Column({ default: false })
  isBlockClientArea: boolean = false;

  @Column({ default: false })
  isBonusAbuser: boolean = false;

  @Column({ default: false })
  isShowTradingCentral: boolean = false;

  @Column({ default: false })
  isAutomaticWithdrawal: boolean = false;

  @Column({ default: false })
  email_sent_for_review: boolean;

  @Column({ nullable: true })
  completedSteps: number;

  @Column({ nullable: true })
  kycStatus: number;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ nullable: true })
  isDeleted: boolean = false;

  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  photo?: FileEntity | null;

  @ManyToOne(() => Role, {
    eager: true,
  })
  role?: Role | null;

  @ManyToOne(() => Status, {
    eager: true,
  })
  status?: Status;

  @Column({ nullable: true })
  server: string;

  @Column({ nullable: true })
  userSource: string;

  @Column({ nullable: true })
  localTimeApprox: string;

  @Column({ nullable: true, default: false })
  phoneSuspicious: boolean;

  @Column({ nullable: true, default: false })
  phoneGoogleVerified: boolean;

  @Column({ nullable: true, default: false })
  loggedIn: boolean;

  @Column({ nullable: true, default: false })
  loggedInMetaTraders: boolean;

  @Column({ nullable: true, default: false })
  loggedInPremiumMobile: boolean;

  @Column({ nullable: true, default: false })
  loggedInPremiumWebtrader: boolean;

  @Column({ nullable: true })
  salesLastAssigned: string;

  @Column({ nullable: true })
  retentionLastAssigned: string;

  @Column({ nullable: true, type: 'float', default: 0 })
  kycScore: number;

  @Column({ nullable: true })
  acquisitionStatus: string;

  @Column({ nullable: true })
  marketingType: string;

  @Column({ nullable: true, default: false })
  previouslyNI: boolean;

  @Column({ nullable: true })
  fnsStatus: string;

  @Column({ nullable: true })
  registrationClassification: string;

  @Column({ nullable: true })
  intendedClassification: string;

  @Column({ nullable: true })
  ninjaDesk: string;

  @Column({ nullable: true, type: 'text' })
  topTradingProducts: string;

  @Column({ nullable: true })
  timesOfFTD: Date;

  @Column({ nullable: true })
  timesOfLTD: Date;

  @Column({ nullable: true })
  depositCount: number;

  @Column({ nullable: true })
  daysWithoutDeposit: number;

  @Column({ nullable: true })
  registrationTime: Date;

  @Column({ nullable: true })
  registrationDevice: Date;

  @Column({ nullable: true })
  modifiedTime: Date;

  @Column({ nullable: true })
  lastRetentionAssignmentDate: Date;

  @Column({ nullable: true })
  lastTimeLogin: Date;

  @Column({ nullable: true })
  lastTradeTime: Date;

  @Column({ nullable: true })
  lastCommunicationTime: Date;

  @Column({ nullable: true, default: false })
  emailBounced: boolean;

  @Column({ nullable: true, default: false })
  FTD: boolean;

  @Column({ nullable: true })
  SYSTEM: string;

  @Column({ nullable: true })
  NORMBALANCE: number;

  @Column({ nullable: true })
  NORMCREDIT: number;

  @Column({ nullable: true })
  NORMFEES: number;

  @Column({ nullable: true })
  NORMEQUITY: number;

  @Column({ nullable: true })
  NORMMARGIN: number;

  @Column({ nullable: true })
  NORMOPENPNL: number;

  @Column({ nullable: true })
  NORMCLOSEPNL: number;

  @Column({ nullable: true })
  NORMNETDEPOSIT: number;

  @Column({ nullable: true })
  numberOfLiveAcc: number;

  @Column({ nullable: true })
  tickets: string; // Assuming this is a stringified JSON array

  @Column({ nullable: true, default: false })
  PRO: boolean;

  @Column({ nullable: true })
  accountType: string;

  @Column({ nullable: true, default: false })
  extendCallHours: boolean;

  @Column({ nullable: true })
  extendCallHoursDecisionTime: Date;

  @Column({ nullable: true })
  tradingStyle: string;

  @Column({ nullable: true })
  kycClientType: string;

  @Column({ nullable: true })
  tradingAccExternalIds: string;

  @Column({ nullable: true })
  referrerType: string;

  @Column({ nullable: true })
  auditGrading: string;

  @Column({ nullable: true })
  pendingGrading: string;

  @Column({ nullable: true })
  tone: string;

  @Column({ nullable: true })
  approach: string;

  @Column({ nullable: true })
  uspsProperlyMentioned: string;

  @Column({ nullable: true })
  futureTaskScheduled: string;

  @Column({ nullable: true })
  auditorName: string;

  @Column({ nullable: true })
  auditTime: Date;

  @Column({ nullable: true })
  idVerificationStatus: string;

  @Column({ nullable: true })
  porVerificationStatus: string;

  @Column({ nullable: true })
  accountStatus: string;

  @Column({ nullable: true })
  actions: string;

  @Column({ nullable: true, default: 1 })
  suppoertStatusId: number;

  @Column({ nullable: true })
  supportStatus: string;

  @Column({ nullable: true, default: 1 })
  financeStatusId: number;

  @Column({ nullable: true })
  financeStatus: string;

  @Column({ nullable: true })
  @IsOptional()
  appRegistration: string;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  appsFlyerId: number;

  @Column({ nullable: true })
  @IsOptional()
  affiliate: string;

  @Column({ nullable: true })
  @IsOptional()
  affiliateLinkUrl: string;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  affiliateLinkId: number;

  @Column({ nullable: true })
  @IsOptional()
  ip: string;

  @Column({ nullable: true })
  @IsOptional()
  tracking: string;

  @Column({ nullable: true })
  @IsOptional()
  source: string;

  @Column({ nullable: true })
  @IsOptional()
  clientGrading: string;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  clickId: number;

  @Column({ nullable: true })
  @IsOptional()
  creationTime: Date;

  @Column({ nullable: true, default: false })
  @IsOptional()
  pendingInvestigation: boolean;

  @Column({ nullable: true })
  @IsOptional()
  kycWorkflowStatus: string;

  @Column({ nullable: true, type: 'nvarchar' })
  @IsOptional()
  regulations: string;

  @ManyToOne(() => Regulations, { nullable: true })
  regulation: Regulations;

  @Column({ nullable: true })
  @IsOptional()
  clientStatus: string;

  // @Column({ nullable: true })
  // @IsOptional()
  // lastLoginTime: string;
  @Column({ nullable: true })
  @IsOptional()
  facebookUID: string;

  @Column({ nullable: true })
  @IsOptional()
  firstSalesDeskId: number;

  @Column({ nullable: true })
  @IsOptional()
  fullName: string;

  @Column({ nullable: true })
  @IsOptional()
  googleUID: string;

  @Column({ nullable: true })
  @IsOptional()
  hasBrokerUser: boolean;

  @Column({ nullable: true })
  @IsOptional()
  isDemo: boolean;

  @Column({ nullable: true })
  @IsOptional()
  isTradingActive: boolean;

  @Column({ nullable: true })
  @IsOptional()
  lastActionTime: Date;

  @Column({ nullable: true })
  @IsOptional()
  originalAffiliate: string;

  @Column({ nullable: true })
  @IsOptional()
  originAlffiliateId: number;

  @Column({ nullable: true })
  @Index()
  @Expose({ groups: ['me', 'admin'] })
  originalEmail: string;

  //is it different from ip column

  @Column({ nullable: true })
  @IsOptional()
  registrationIp: string;

  @Column({ nullable: true })
  @IsOptional()
  orignalSource: string;

  @Column({ nullable: true })
  @IsOptional()
  orignalTelephone: string;

  @Column({ nullable: true })
  @IsOptional()
  OrginalTelephonePrefix: string;

  @Column({ type: String, nullable: true })
  @IsOptional()
  passwordExpiryDate: Date | null;

  @Column({ nullable: true })
  @IsOptional()
  registrationAffiliateId: number;

  @Column({ nullable: true })
  @IsOptional()
  clientAreaUrl: number;

  @Column({ type: String, nullable: true })
  @IsOptional()
  telephoneConfirmationTime: Date | null;

  @Column({ nullable: true })
  @IsOptional()
  isTelephoneConfirmed: boolean;

  // @Column({ nullable: true })
  // @IsOptional()
  // fullAddress: string;
  @Column({ nullable: true })
  lastLoginTime: Date;

  @Column({ nullable: true })
  firsSalesDeskId: number;

  @Column({ nullable: true })
  orignalEmail: string;

  @Column({ default: false })
  isSwapFree: boolean;

  @Column({ default: true })
  isPendingWithdrawalVisible: boolean;

  @Column({ default: true })
  isWithdrawRequestAllowed: boolean;

  @Column({ nullable: true, length: 'MAX' })
  campaignQuestions: string;

  @OneToOne(() => AdminTask, (task) => task.client, { nullable: true })
  @JoinColumn({ name: 'recentTaskId' })
  recentTask: AdminTask | null;

  @Column({
    type: 'nvarchar',
    nullable: true,
    default: UserLifeCycle.REGISTERED,
  })
  userLifeCycle: UserLifeCycle;

  @Column({ nullable: true })
  leadId?: number;

  @ManyToOne(() => Lead)
  @JoinColumn({ name: 'leadId' })
  lead: Lead;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true, type: 'nvarchar' })
  localTime: string;

  @Column({ nullable: true, type: 'nvarchar' })
  preferredTime: string;

  @Column({ nullable: true })
  @IsOptional()
  totalDeposits: string;

  @Column({ nullable: true, type: 'nvarchar' })
  createdBy: string;

  @Column({ nullable: true, type: 'nvarchar' })
  modifiedBy: string;

  @Column({ nullable: true, type: 'nvarchar' })
  skypeID: string;

  @Column({ nullable: true, type: 'nvarchar' })
  leadTitle: string;

  @Column({ nullable: true })
  salesManagerId: number;

  @Column({ nullable: true })
  salesManager: string;

  @Column({ nullable: true })
  retentionManagerId: number;

  @Column({ nullable: true })
  retentionManager: string;

  @Column({ nullable: true })
  financeManagerId: number;

  @Column({ nullable: true })
  financeManager: string;

  @Column({ nullable: true })
  kycManagerId: number;

  @Column({ nullable: true })
  kycManager: string;

  @Column({ nullable: true })
  supportManagerId: number;

  @Column({ nullable: true })
  supportManager: string;

  @Column({ nullable: true })
  tradingActiveDaily: boolean;

  @Column({ nullable: true })
  tradingActiveWeekly: boolean;

  @Column({ nullable: true })
  tradingActiveMonthly: boolean;

  @Column({ nullable: true })
  ftdAmount: number;

  @Column({ nullable: true })
  adjustedFtdAmount: number;

  @Column({ default: false })
  isTransferToRetention: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  totp_key: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  totp_key_url: string | null;

  @Column({ default: false })
  sendBackToSales: boolean;

  @Column({ nullable: true })
  lastRetentionAssignAt: Date;

  @Column({ nullable: true })
  retentionAction: string;

  @Column({ nullable: true })
  retentionActionDate: Date;

  @Column({ nullable: true })
  kycFollowUpAt: Date;

  @OneToMany(() => IbCommissionDeals, (commission) => commission.client)
  ibCommissionDeals: IbCommissionDeals[];

  @Column({ default: false })
  isMt5CreationDisabled: boolean;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true, default: 'New' })
  systemStatus: string;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  systemStatusLogs: string;

  @Column({ default: false })
  isCopyTrading: boolean;

  @JoinColumn({ name: 'commissionProfileId' })
  @ManyToOne(() => IbCommissionProfile)
  commissionProfile: IbCommissionProfile;

  @Column({ default: false })
  isFirstTimeNameChange: boolean;

  @Column({ default: false })
  isPhoneCountryChanged: boolean;

  @Column({ default: false })
  typeIb: boolean;
}
