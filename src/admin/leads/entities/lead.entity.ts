import { CustomStatus } from 'src/admin/client/entities/custom_status.entity';
import { Office } from 'src/admin/custom-dropdown/custom-dropdown/entities/office.entity';
import { LeadsCallLog } from 'src/admin/leads-call-logs/entities/leads-call-log.entity';
import { Partner } from 'src/settings/entities/partner.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { attachments } from '../opportunity/entities/attachment.entity';
import { LeadAnswer } from './lead-answer.entity';
import { UserLifeCycle } from 'src/utils/enums/user-lifecycle.enum';
import { IsOptional } from 'class-validator';
import { AdminTask } from 'src/admin/task/entities/task.entity';
import { Regulations } from 'src/admin/regulations/entities/regulations.entity';
import { notes } from 'src/admin/kyc/entities/kycNotes.entity';
import { Client } from 'src/users/entities/client.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';

@Entity()
@Check(`"userLifeCycle" IN ('lead', 'registered', 'applicant', 'client')`)
export class Lead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'nvarchar' })
  leadOwner: string;

  @Column({ nullable: true, type: 'nvarchar' })
  title: string;

  @Column({
    default: 'Individual Client (IC)',
    nullable: true,
    type: 'varchar',
  })
  typeOfBusiness: string;

  @Column({ nullable: true, type: 'nvarchar' })
  noOfLocations: string;

  @Column({ nullable: true, type: 'nvarchar' })
  fax: string;

  @Column({ nullable: true, type: 'nvarchar' })
  phoneNumber: string;

  @Column({ nullable: true, type: 'nvarchar' })
  telephonePrefix: string;

  @Column({ nullable: true, type: 'nvarchar' })
  telephone: string;

  @Column({ nullable: true, type: 'nvarchar' })
  mobile: string;

  @Column({ nullable: true, type: 'nvarchar' })
  leadSource: string;

  @Column({ nullable: true, type: 'nvarchar' })
  industury: string;

  @Column({ nullable: true, type: 'nvarchar' })
  annualOptOut: string;

  @Column({ nullable: true, type: 'nvarchar' })
  emailOptOut: string;

  @Column({ nullable: true, type: 'nvarchar' })
  modifiedBy: string;

  @Column({ nullable: true, type: 'nvarchar' })
  companyName: string;

  @Column({ nullable: true, type: 'nvarchar' })
  firstName: string;

  @Column({ nullable: true, type: 'nvarchar' })
  lastName: string;

  @Column({ nullable: true, unique: true, type: 'varchar' })
  email: string;

  @Column({ nullable: true, type: 'nvarchar' })
  website: string;

  @Column({ nullable: true, type: 'nvarchar' })
  noOfEmployees: string;

  @Column({ nullable: true, type: 'nvarchar' })
  rating: string;

  @Column({ nullable: true, type: 'nvarchar' })
  createdBy: string;

  @ManyToOne(() => Operator, { nullable: true })
  createdByOperator: Operator;

  @Column({ nullable: true, type: 'nvarchar' })
  skypeID: string;

  @Column({ nullable: true, type: 'nvarchar' })
  secondaryEmail: string;

  @Column({ nullable: true, type: 'nvarchar' })
  twitter: string;

  @Column({ nullable: true, type: 'nvarchar' })
  streetAddress: string;

  @Column({ nullable: true, type: 'nvarchar' })
  state: string;

  @Column({ nullable: true, type: 'nvarchar' })
  addresssLastName: string;

  @Column({ nullable: true, type: 'nvarchar' })
  city: string;

  @Column({ nullable: true, type: 'nvarchar' })
  zipCode: string;

  @Column({ nullable: true, type: 'nvarchar' })
  addressNoOfLocations: string;

  @Column({ nullable: true, type: 'nvarchar' })
  infoStreet: string;

  @Column({ nullable: true, type: 'nvarchar' })
  affiliate: string;

  @Column({ nullable: true, type: 'nvarchar' })
  vistID: string;

  @Column({ nullable: true, type: 'nvarchar' })
  source: string;

  @Column({ nullable: true, type: 'nvarchar' })
  p1: string;

  @Column({ nullable: true, type: 'nvarchar' })
  p2: string;

  @Column({ nullable: true, type: 'nvarchar' })
  p3: string;

  @Column({ nullable: true, type: 'nvarchar' })
  p4: string;

  @Column({ nullable: true, type: 'nvarchar' })
  p5: string;

  @Column({ nullable: true, type: 'nvarchar' })
  p6: string;

  @Column({ nullable: true })
  pu: boolean;

  @Column({ nullable: true })
  registrationDate: Date;

  @Column({ nullable: true, type: 'nvarchar' })
  registrationDevice: string;

  @Column({ nullable: true, type: 'nvarchar' })
  registrationIP: string;

  @Column({ nullable: true })
  lastCommunication: Date;

  @Column({ nullable: true })
  lastUpdate: Date;

  @Column({ nullable: true, type: 'nvarchar' })
  utmSource: string;

  @Column({ nullable: true, type: 'nvarchar' })
  utmCampaign: string;

  @Column({ nullable: true, type: 'nvarchar' })
  utmTerm: string;

  @Column({ nullable: true, type: 'nvarchar' })
  utmMedium: string;

  @Column({ nullable: true, type: 'nvarchar' })
  utmContent: string;

  @Column({ nullable: true, type: 'nvarchar' })
  campaignID: string;

  @Column({ nullable: true, type: 'nvarchar' })
  clientID: string;

  @Column({ nullable: true, type: 'nvarchar' })
  leadGrading: string;

  @Column({ nullable: true, type: 'nvarchar' })
  designation: string;

  @Column({ nullable: true, type: 'nvarchar' })
  expectedInvestment: string;

  @Column({ default: 'United Arab Emirates', nullable: true, type: 'nvarchar' })
  country: string;

  @Column({ default: 'AE', nullable: true, type: 'nvarchar' })
  countryIso: string;

  @Column({ nullable: true, type: 'nvarchar' })
  language: string;

  @Column({ nullable: true, type: 'nvarchar' })
  referral: string;

  @Column({ nullable: true, type: 'nvarchar' })
  localTime: string;

  @Column({ nullable: true, type: 'nvarchar' })
  preferredTime: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  salesDeskId: number;

  @Column({ nullable: true })
  salesDesk: string;

  @Column({ nullable: true })
  salesRepId: number;

  @Column({ nullable: true })
  salesRep: string;

  @Column({ nullable: true })
  salesManagerId: number;

  @Column({ nullable: true })
  salesManager: string;

  @Column({ nullable: true })
  retentionDeskId: number;

  @Column({ nullable: true })
  retentionDesk: string;

  @Column({ nullable: true })
  retentionRepId: number;

  @Column({ nullable: true })
  retentionRep: string;

  @Column({ nullable: true })
  retentionManagerId: number;

  @Column({ nullable: true })
  retentionManager: string;

  // @Column({ nullable: true })
  // internalRetentionStatus: number;

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
  officeId: number;

  @Column({ nullable: true })
  office: string;

  @Column({ nullable: true })
  kycDeskId: number;

  @Column({ nullable: true })
  kycDesk: string;

  @Column({ nullable: true })
  kycRepId: number;

  @Column({ nullable: true })
  kycRep: string;

  @ManyToOne(() => Partner, (partner) => partner.leadPartner)
  salesPartner: Partner;

  @ManyToOne(() => Office, (office) => office.leadOffice)
  salesOffice: Office;

  @ManyToOne(() => CustomStatus)
  // @JoinColumn({ name: 'leadStatusId' })
  leadStatus: CustomStatus;

  @ManyToOne(() => CustomStatus)
  // @JoinColumn({ name: 'salesStatusId' })
  salesStatus: CustomStatus;

  @ManyToOne(() => CustomStatus)
  //@JoinColumn({ name: 'retentionStatusId', referencedColumnName: 'id' })
  retentionStatus: CustomStatus;

  @ManyToOne(() => CustomStatus)
  @JoinColumn({ name: 'kycStatus' })
  customKycStatus: CustomStatus;

  @OneToMany(() => LeadsCallLog, (leadsCallLog) => leadsCallLog.lead)
  leadsCallLog: LeadsCallLog;

  @OneToMany(() => attachments, (attachment) => attachment.leadId)
  attachments: attachments[];

  @OneToMany(() => LeadAnswer, (answer) => answer.lead)
  answers: LeadAnswer[];

  @OneToMany(() => AdminTask, (task) => task.lead)
  tasks: AdminTask[];

  @OneToMany(() => notes, (leadsNote) => leadsNote.lead_id)
  leadNotes: notes;

  @Column({ nullable: true, type: 'varchar', default: UserLifeCycle.LEAD })
  userLifeCycle: UserLifeCycle;

  @Column({ nullable: true })
  @IsOptional()
  appRegistration: string;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  appsFlyerId: number;

  @Column({ nullable: true, type: 'text' })
  queryString: string;

  @Column({ nullable: true })
  @IsOptional()
  affiliateLinkUrl: string;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  affiliateLinkId: number;

  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  affId: string;

  @Column({ nullable: true })
  @IsOptional()
  externalId: string;

  @Column({ nullable: true })
  @IsOptional()
  ip: string;

  @Column({ nullable: true })
  @IsOptional()
  creationTime: Date;

  @Column({ nullable: true })
  @IsOptional()
  tracking: string;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  clickId: number;

  @Column({ nullable: true })
  @IsOptional()
  kycStatus: number;

  @Column({ nullable: true })
  @IsOptional()
  type: string;

  @Column({ nullable: true })
  @IsOptional()
  industry: string;

  @Column({ nullable: true })
  @IsOptional()
  callOptOut: string;

  @Column({ nullable: true, default: 'FSCA' })
  regulations: string;

  @ManyToOne(() => Regulations, { nullable: true })
  regulation: Regulations;

  @Column({ nullable: true })
  @IsOptional()
  totalDeposits: string;

  @Column({ type: 'datetime2', nullable: true }) //kycfill = applicant
  applicantCreatedTime: Date | null;

  @Column({ type: 'datetime2', nullable: true }) //userRegester
  registeredCreatedTime: Date | null;

  @Column({ type: 'datetime2', nullable: true }) //kycApprove
  clientCreatedTime: Date | null;

  @Column({ nullable: true, default: false })
  hasAttendedEvent: boolean;

  @Column({ nullable: true })
  minutesOfAttendance: number;

  @CreateDateColumn({ nullable: true, type: 'datetime' })
  lastAttendedDate: Date;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true, default: false })
  FTD: boolean;

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

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'clientID' })
  client: Client;

  @Column({ nullable: true })
  ftdAmount: number;

  @Column({ nullable: true })
  adjustedFtdAmount: number;

  @Column({ nullable: true })
  timesOfFTD: Date;

  @Column({ nullable: true })
  timesOfLTD: Date;

  @Column({ nullable: true })
  salesStatusUpdatedAt: Date;

  @Column({ nullable: true })
  retentionStatusUpdatedAt: Date;

  @Column({ nullable: true, length: 'MAX' })
  latestNote: string;

  @Column({ nullable: true })
  lastNoteAt: Date;

  @Column({ nullable: true, length: 'MAX' })
  speakingLanguage: string;

  @Column({ default: false })
  isTransferToRetention: boolean;

  @Column({ default: false })
  isDuplicated: boolean;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true, default: 'New' })
  systemStatus: string;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  systemStatusLogs: string;

  @Column({ nullable: true })
  nextActionTime: Date;
}
