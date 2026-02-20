import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { Client } from 'src/users/entities/client.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  DeleteDateColumn,
} from 'typeorm';
import { PartnerTradingGroups } from './partner-trading-groups.entity';
import { Exclude } from 'class-transformer';
import bcrypt from 'bcryptjs';
import { partner_links } from 'src/admin/partner/entities/partner-links.entity';
import { partner_kyc_documents } from 'src/admin/partner-kyc-docs/entities/partner_kyc_docs.entity';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import crypto from 'crypto';
import { IbCommissionProfile } from 'src/ib/ib_profile/entities/ib_commission_profile.entity';
import { IbCommissionDeals } from 'src/ib/entities/ib-commission-deals.entity';
import { PartnerType } from 'src/admin/custom-dropdown/custom-dropdown/entities/partner-type.entity';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { PartnerCommissionProfile } from './partner-commission-profile.entity';
import { User } from 'src/users/entities/user.entity';

export enum ActiveStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum Approved {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  PENDING = 'PENDING',
}

@Entity()
export class Partner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  contactName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Exclude({ toPlainOnly: true })
  public previousPassword: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @Column({ nullable: true })
  telephone: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  skype: string;

  @Column({ nullable: true })
  apiKey: string;

  @Column({ nullable: true })
  platformId: number;

  @Column({ nullable: true })
  regulated: boolean;

  @Column({ nullable: true })
  ib: boolean;

  @Column({ nullable: true })
  referrerId: number;

  @ManyToOne(() => Operator)
  @JoinColumn({ name: 'referrerId' })
  referrer: Operator;

  @OneToMany(() => User, (u) => u.partner)
  user: User;

  @Column({ nullable: true })
  affiliateManagerId: number;

  @Column({ nullable: true })
  appId: number;

  @Column({ nullable: true })
  referralPercentage: number;

  @Column({ type: 'simple-enum', enum: ActiveStatus })
  status: ActiveStatus;

  @Column({ type: 'simple-enum', enum: Approved, nullable: true })
  approved: Approved;

  @Column({ nullable: true })
  dailyCount: number;

  @Column({ nullable: true })
  dailyLimit: number;

  @Column({ nullable: true })
  minDepositAmount: number;

  @Column({ nullable: true })
  userIbId: string;

  @ManyToOne(() => Mt5Account, { nullable: true })
  mt5Account: Mt5Account;

  @Column({ type: 'nvarchar', nullable: true, length: 'max' })
  blockedCountry: string;

  @Column({ nullable: true })
  externalId: string;

  @Column({ nullable: true })
  maxPay: number;

  @Column({ nullable: true })
  overPaid: number;

  @Column({ type: 'nvarchar', nullable: true, length: 'max' })
  allowedCountry: string;

  @Column({ nullable: true })
  registrationNotes: string;

  @Column({ nullable: true })
  bypassIpWhitelist: boolean;

  @Column({ nullable: true })
  onlyShowFtds: boolean;

  @Column({ nullable: true })
  apiWhitelistIps: string;

  @Column({ nullable: true })
  blockedSources: string;

  @Column({ nullable: true, default: false })
  trackVisit: boolean;

  @Column({ nullable: true, default: null })
  trackVisitRL: boolean;

  @Column({ nullable: true, default: null })
  trackVisitRLInterval: number;

  @Column({ nullable: true, default: false })
  registerUser: boolean;

  @Column({ nullable: true, default: null })
  registerUserRL: boolean;

  @Column({ nullable: true, default: null })
  registerUserRLInterval: number;

  @Column({ nullable: true, default: false })
  registerLead: boolean;

  @Column({ nullable: true, default: false })
  registerLeadRL: boolean;

  @Column({ nullable: true, default: null })
  registerLeadRLInterval: number;

  @Column({ nullable: true, default: false })
  getUsers: boolean;

  @Column({ nullable: true, default: null })
  getUsersRL: boolean;

  @Column({ nullable: true, default: null })
  getUsersRLInterval: number;

  @Column({ nullable: true, default: false })
  getUser: boolean;

  @Column({ nullable: true, default: null })
  getUserRL: boolean;

  @Column({ nullable: true, default: null })
  getUserRLInterval: number;

  @Column({ nullable: true, default: false })
  getDeposits: boolean;

  @Column({ nullable: true, default: null })
  getDepositsRL: boolean;

  @Column({ nullable: true, default: null })
  getDepositsRLInterval: number;

  @Column({ nullable: true, default: false })
  getStats: boolean;

  @Column({ nullable: true, default: null })
  getStatsRL: boolean;

  @Column({ nullable: true, default: null })
  getStatsRLInterval: number;

  @Column({ nullable: true, default: false })
  getSalesStatuses: boolean;

  @Column({ nullable: true, default: false })
  getSalesStatusesRL: boolean;

  @Column({ nullable: true, default: null })
  getSalesRLInterval: number;

  @Column({ nullable: true, default: false })
  getDeposit: boolean;

  @Column({ nullable: true, default: null })
  getDepositRL: boolean;

  @Column({ nullable: true, default: null })
  getDepositRLInterval: number;

  @Column({ nullable: true })
  syncUserTransaction: boolean;

  @Column({ nullable: true, default: false })
  syncUserTransactionRL: boolean;

  @Column({ nullable: true, default: false })
  syncUserTransactionRLInterval: number;

  @Column({ nullable: true })
  syncUserNote: boolean;

  @Column({ nullable: true, default: false })
  syncUserNoteRL: boolean;

  @Column({ nullable: true, default: false })
  syncUserNoteRInterval: number;

  @Column({ nullable: true })
  regenerateUserAutologinUrl: boolean;

  @Column({ nullable: true, default: false })
  regenerateUserAutologinUrlRL: boolean;

  @Column({ nullable: true, default: false })
  regenerateUserAutologinUrlRLInterval: number;

  @Column({ nullable: true })
  getUserClosedTrades: boolean;

  @Column({ nullable: true, default: false })
  getUserClosedTradesRL: boolean;

  @Column({ nullable: true, default: false })
  getUserClosedTradesRLInterval: number;

  @Column({ nullable: true })
  getWithdrawal: boolean;

  @Column({ nullable: true, default: false })
  getWithdrawalRL: boolean;

  @Column({ nullable: true, default: false })
  getWithdrawalRLInterval: number;

  @Column({ nullable: true })
  getWithdrawals: boolean;

  @Column({ nullable: true, default: false })
  getWithdrawalsRL: boolean;

  @Column({ nullable: true, default: null })
  getWithdrawalsRLInterval: number;

  @Column({ nullable: true })
  createAffiliate: boolean;

  @Column({ nullable: true, default: false })
  createAffiliateRL: boolean;

  @Column({ nullable: true, default: false })
  createAffiliateRLInterval: number;

  @Column({ nullable: true })
  editAffiliate: boolean;

  @Column({ nullable: true })
  editAffiliateRL: boolean;

  @Column({ nullable: true })
  editAffiliateRLInterval: boolean;

  @Column({ nullable: true })
  getAffiliate: boolean;

  @Column({ nullable: true })
  getAffiliateRL: boolean;

  @Column({ nullable: true })
  getAffiliateRLInterval: boolean;

  @Column({ type: 'uuid', nullable: true })
  uuid: string;

  @Column({ nullable: true })
  registrationIp: string;

  @Column({ nullable: true })
  revSharePercent: number;

  @Column({ nullable: true })
  managerOperatorId: number;

  @Column({ nullable: true })
  isRecycleActive: boolean;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  source: string;

  @Column({ nullable: true })
  totalCount: number;

  @Column({ nullable: true })
  sourceOverride: string;

  @Column({ nullable: true })
  isPrivate: boolean;

  @Column({ nullable: true })
  externalAuthId: string;

  @Column({ nullable: true })
  applicationStatus: string;

  @Column({ nullable: true })
  customerSupport: string;

  @Column({ nullable: true })
  marketingEmailsEnabled: string;

  @Column({ nullable: true })
  scheme: string;

  @Column({ nullable: true })
  entity: string;

  @Column({ nullable: true })
  platformIdGroup: number;

  @Column({ nullable: true })
  membership: string;

  @Column({ nullable: true })
  isDeleted: boolean;

  @Column({ nullable: true })
  kycStatus: string;

  @Column({ nullable: true })
  partnerTypeId: number;

  @ManyToOne(() => PartnerType, { nullable: true })
  @JoinColumn({ name: 'partnerTypeId' })
  partnerType: PartnerType;

  @Column({ nullable: true })
  isApproved: boolean;

  @Column({ nullable: true })
  operatorId: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;

  @OneToOne(
    () => PartnerTradingGroups,
    (partnerTradingGroups) => partnerTradingGroups.partner,
  )
  tradingGroup: PartnerTradingGroups;
  @OneToMany(() => Client, (clients) => clients.affid)
  clients: Client[];

  @OneToMany(
    () => partner_kyc_documents,
    (partnerKycDocuments) => partnerKycDocuments.partner,
  )
  partnerKycDocuments: partner_kyc_documents[];

  @OneToMany(() => partner_links, (partner_links) => partner_links.partnerId)
  partner_links: partner_links[];

  @OneToMany(() => Lead, (lead) => lead.salesPartner)
  leadPartner: Lead;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  partnerLevel: number;

  @Column({ nullable: true })
  masterIbId: number;

  @Column({ nullable: true })
  ibPath: string;

  @ManyToOne(
    () => IbCommissionProfile,
    (commissionProfile) => commissionProfile.partner,
    { nullable: true },
  )
  commissionProfile: IbCommissionProfile;

  @OneToMany(() => PartnerCommissionProfile, (profile) => profile.partner)
  commissionProfiles: PartnerCommissionProfile[];

  @OneToMany(() => IbCommissionDeals, (commission) => commission.partner)
  ibCommissionDeals: IbCommissionDeals[];

  @Column({ default: false })
  calculateCommission: boolean;

  @Column({ default: true })
  autoLinkMt5: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  setName() {
    if (this.firstName && this.lastName) {
      this.name = `${this.firstName} ${this.lastName}`;
    } else if (this.firstName) {
      this.name = this.firstName; // If only firstName exists
    } else if (this.lastName) {
      this.name = this.lastName; // If only lastName exists
    }
  }

  @BeforeInsert()
  setUuid() {
    const buffer = crypto.randomBytes(16);
    buffer[6] = (buffer[6] & 0x0f) | 0x40;
    buffer[8] = (buffer[8] & 0x3f) | 0x80;
    const uuid = `${buffer.toString('hex', 0, 4)}-${buffer.toString(
      'hex',
      4,
      6,
    )}-${buffer.toString('hex', 6, 8)}-${buffer.toString(
      'hex',
      8,
      10,
    )}-${buffer.toString('hex', 10, 16)}`;
    this.uuid = uuid;
  }
}
