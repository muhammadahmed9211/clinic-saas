import {
  Column,
  AfterLoad,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  Index,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Status } from '../../statuses/entities/status.entity';
import { FileEntity } from '../../files/entities/file.entity';
import bcrypt from 'bcryptjs';
import { EntityHelper } from '../../utils/entity-helper';
import { AuthProvidersEnum } from '../../auth/auth-providers.enum';
import { Exclude, Expose } from 'class-transformer';
import { Client } from './client.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { notes } from 'src/admin/kyc/entities/kycNotes.entity';
import { notifications } from '../../notification/entity/notification.entity';
import { AdminTask } from 'src/admin/task/entities/task.entity';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { user_kyc_documents } from 'src/user-kyc-docs/entities/user-kyc-documents.entity';
import { LeverageRequest } from 'src/trading/entities/leverage-request.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { Meetings } from 'src/admin/leads/meetings/entities/meetings.entity';
import { attachments } from 'src/admin/leads/opportunity/entities/attachment.entity';
import { LeadQuestion } from 'src/admin/questions/entities/question.entity';
import { IsOptional } from 'class-validator';
import { Layout } from 'src/mail/entities/layout.entity';
import { Template } from 'src/mail/entities/template.entity';
import { Partner } from 'src/settings/entities/partner.entity';
import { FavouriteSymbol } from 'src/mt5/entities/mt5-favourite-symbol.entity';
import { DeviceInfo } from 'src/push-notification/entities/device-info.entity';

export enum LanguageType {
  English = 'EN',
  Arabic = 'AR',
}

@Entity()
export class User extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', default: () => 'NEWID()' })
  uuid: string; // New column for UUID

  // For "string | null" we need to use String type.
  // More info: https://github.com/typeorm/typeorm/issues/2567
  @Column({ type: String, unique: true, nullable: true })
  // @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
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

  @BeforeInsert()
  @BeforeUpdate()
  setTel() {
    if (this.telephonePrefix && this.telephone) {
      const tel = `${this.telephonePrefix}${this.telephone}`;
      this.tel = tel;
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  setFullName() {
    let fullName = '';
    if (this.firstName) {
      fullName = `${this.firstName}`;
    }
    if (this.lastName) {
      fullName = `${fullName} ${this.lastName}`;
    }
    if (fullName) {
      this.fullName = fullName;
    }
  }

  @Column({ default: AuthProvidersEnum.email })
  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @Column({ type: String, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  socialId: string | null;

  @Column({ type: String, nullable: true })
  firstName: string | null;

  @Column({ type: String, nullable: true })
  lastName: string | null;

  @Column({ type: String, nullable: true })
  fullName: string | null;

  @Column({ type: String, nullable: true })
  telephone: string | null;

  @Column({ type: String, nullable: true })
  telephonePrefix: string | null;

  @Column({ nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  tel: string;

  @Column({ type: String, nullable: true })
  dob: Date | null;

  @Column({ type: String, nullable: true })
  address: string | null;

  @Column({ type: String, nullable: true })
  nationality: string | null;

  @Column({ type: String, nullable: true })
  countryIso: string | null;

  @Column({ type: String, nullable: true })
  country: string | null;

  @Column({ type: String, nullable: true })
  city: string | null;

  @Column({ type: String, nullable: true })
  state: string | null;

  @Column({ type: String, nullable: true })
  postalCode: string | null;

  @Column({
    type: 'simple-enum',
    enum: LanguageType,
    default: LanguageType.English,
  })
  languageIso: LanguageType;

  @Column({ type: 'bit', nullable: true })
  demo: boolean;

  @Column({ type: String, nullable: true })
  affid: string | null;

  @Column({ type: String, nullable: true })
  sc: string | null;

  @Column({ type: Number, nullable: true })
  userType: number | null;

  @Column({ type: Number, nullable: true })
  partnerId: number | null;

  @Column({ default: false })
  isBroker: boolean = false;

  @Column({ default: false })
  isClient: boolean = false;

  @Column({ default: false })
  isOperator: boolean = false;

  @Column({ default: false })
  isPartner: boolean = false;

  @Column({ nullable: true })
  isDeleted: boolean = false;

  @Column({ nullable: true })
  isEmailNotificationsEnabled: boolean = true;

  @Column({ nullable: true })
  isWhatsappNotificationsEnabled: boolean = true;

  @Column({ nullable: true })
  isSmsNotificationsEnabled: boolean = true;

  @Column({ default: false })
  totp: boolean;

  @Column({ default: false })
  mobileOtp: boolean;

  @Column({ default: false })
  emailOtp: boolean;

  @Column({ default: false })
  isTotpDefault: boolean;

  @Column({ default: false })
  isMobileOtpDefault: boolean;

  @Column({ default: false })
  isEmailOtpDefault: boolean;

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

  @OneToOne(() => Client, (client) => client.user)
  client: Client;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Wallet, (wallet) => wallet.user, { onDelete: 'CASCADE' })
  wallets: Wallet[];

  @OneToMany(() => FileEntity, (file) => file.user, { onDelete: 'CASCADE' })
  @Exclude()
  files: FileEntity[];

  @OneToMany(() => notes, (kycNote) => kycNote.user_id)
  kycNotes: notes[];

  @OneToMany(() => notes, (kycNote) => kycNote.partner_id)
  partner_id: notes[];

  @OneToMany(() => notifications, (notification) => notification.user_id)
  notifications: notifications[];

  @OneToMany(() => notifications, (notification) => notification.creator_id)
  creator_id: notifications[];

  @OneToMany(() => Mt5Account, (Mt5Account) => Mt5Account.user)
  mt5Account: Mt5Account[];

  @OneToMany(() => AdminTask, (task) => task.createdBy)
  createdBy: AdminTask;

  @OneToMany(() => AdminTask, (task) => task.contact)
  contact: AdminTask;

  @OneToMany(
    () => user_kyc_documents,
    (userKycDocuments) => userKycDocuments.user,
  )
  userKycDocuments: user_kyc_documents[];

  @OneToMany(() => LeverageRequest, (LeverageRequest) => LeverageRequest.user)
  LeverageRequest: LeverageRequest;

  @OneToOne(() => Operator, { eager: true, nullable: true })
  @JoinColumn()
  operator: Operator;

  @OneToMany(() => FileEntity, (file) => file.operator, {})
  @Exclude()
  operatorFiles: FileEntity[];

  @ManyToMany(() => Meetings, (meeting) => meeting.participants)
  meetings: Meetings[];

  @OneToMany(() => user_kyc_documents, (kycNote) => kycNote.approvedBy)
  approvedBy: user_kyc_documents[];

  @OneToMany(() => notes, (kycNote) => kycNote.created_by)
  created_by: notes[];

  @OneToMany(() => attachments, (attachment) => attachment.attachedBy)
  attachments: attachments[];

  @OneToMany(() => LeadQuestion, (question) => question.createdBy)
  questions: LeadQuestion[];

  @Column({ nullable: true, default: true })
  @Index()
  @IsOptional()
  isActive: boolean;

  @OneToMany(() => Layout, (layout) => layout.user)
  layout: Layout[];

  @OneToMany(() => Template, (template) => template.user)
  template: Template[];

  @JoinColumn({ name: 'partnerId' })
  @OneToOne(() => Partner)
  partner: Partner;
  //OneToMany relationship for FavouriteSymbol
  @OneToMany(() => FavouriteSymbol, (favouriteSymbol) => favouriteSymbol.user)
  favouriteSymbols: FavouriteSymbol[];

  @Column({ default: false })
  isLongTokenEnabled: boolean;

  @Column({ default: false })
  isTicketUser: boolean;

  @Column({ default: false })
  isIntroducingBroker: boolean;

  @Column()
  commissionProfileId: number;

  @Column()
  accountType: string;

  @OneToMany(() => DeviceInfo, (deviceInfo) => deviceInfo.user)
  devices: DeviceInfo[];
}
