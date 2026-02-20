import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  OneToOne,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { OperatorDeskRel } from './operator-desk.entity';
import { Exclude } from 'class-transformer';
import bcrypt from 'bcryptjs';
import { Role } from 'src/roles/entities/role.entity';
import { notifications } from 'src/notification/entity/notification.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { partner_kyc_documents } from 'src/admin/partner-kyc-docs/entities/partner_kyc_docs.entity';
import { AdminTask } from 'src/admin/task/entities/task.entity';
import { Desk } from './desk.entity';
import { Office } from './office.entity';
import { User } from 'src/users/entities/user.entity';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import { operator_targets } from 'src/admin/operator/entities/operator_targets.entity';

@Entity()
export class Operator extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;

  @Column({ type: 'bigint', default: 0, nullable: true })
  affiliate_id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  country_iso: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  full_name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  first_name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  last_name: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  language_iso: string;

  @Column({ type: 'int', nullable: true })
  system: number;

  @ManyToOne(() => Role, {
    eager: true,
  })
  role?: Role | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
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

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  registration_ip: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  telephone: string;

  @Column({ type: 'bigint', default: 0, nullable: true })
  lead_sender_id: number;

  @Column({ type: 'bigint', nullable: true })
  broker_id: number;

  @Column({ type: 'datetime', nullable: true })
  last_logon_time: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  voip_extension: string;

  @Column({ type: 'bigint', default: 0, nullable: true })
  manager_operator_id: number;

  @Column({ type: 'tinyint', default: 0, nullable: true })
  bypass_ip_whitelist: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  whitelist_ips: string;

  @Column({ type: 'bigint', default: 1, nullable: true })
  ninja_bin: number;

  @Column({ type: 'int', nullable: true })
  ninja_status: number;

  @Column({ type: 'bigint', default: 0, nullable: true })
  daily_goal: number;

  @Column({ type: 'bigint', default: 0, nullable: true })
  monthly_goal: number;

  @Column({ type: 'bigint', default: 0, nullable: true })
  weekly_goal: number;

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
  is_blocked: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  block_reason: string;

  @Column({ type: 'datetime', nullable: true })
  block_time: Date;

  @Column({ type: 'bigint', nullable: true })
  blocked_by: number;

  @Column({ type: 'bigint', default: 0, nullable: true })
  daily_accepted_calls: number;

  @Column({ type: 'bigint', default: 0, nullable: true })
  daily_declined_calls: number;

  @Column({ type: 'bigint', default: 0, nullable: true })
  total_accepted_calls: number;

  @Column({ type: 'bigint', default: 0, nullable: true })
  total_declined_calls: number;

  @Column({ type: 'tinyint', default: 0, nullable: true })
  show_affiliate_sensitive_info: boolean;

  @Column({ type: 'bigint', default: 0, nullable: true })
  daily_goal_number: number;

  @Column({ type: 'bigint', default: 0, nullable: true })
  monthly_goal_number: number;

  @Column({ type: 'bigint', default: 0, nullable: true })
  monthly_sky_goal: number;

  @Column({ type: 'bigint', default: 0, nullable: true })
  monthly_sky_goal_number: number;

  @Column({ type: 'bigint', default: 0, nullable: true })
  weekly_goal_number: number;

  // @Column({ type: 'bigint', nullable: true })
  // role_id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  image_url: string;

  @Column({ type: 'bigint', default: 0, nullable: true })
  app_id: number;

  @Column({ default: false })
  is_test: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  time_zone: string;

  @Column({ type: 'datetime', nullable: true })
  password_expiry_date: Date;

  @Column({ type: 'bigint', default: 0, nullable: true })
  daily_volume_goal: number;

  @Column({ type: 'bigint', default: 0, nullable: true })
  weekly_volume_goal: number;

  @Column({ type: 'bigint', default: 0, nullable: true })
  monthly_volume_goal: number;

  @Column({ type: 'bigint', default: 0, nullable: true })
  monthly_volume_sky_goal: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  password_salt: string;

  @Column({ type: 'bigint', default: 0, nullable: true })
  monthly_accepted_calls: number;

  @Column({ type: 'bigint', default: 0, nullable: true })
  monthly_declined_calls: number;

  @Column({ type: 'bigint', default: 0, nullable: true })
  daily_cancelled_calls: number;

  @Column({ type: 'bigint', default: 0, nullable: true })
  monthly_cancelled_calls: number;

  @Column({ type: 'bigint', default: 0, nullable: true })
  advertiser_id: number;

  @Column({
    type: 'varchar',
    length: 511,
    nullable: true,
  })
  affiliate_ids: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  imap_host: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  imap_port: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  imap_password: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  imap_protocol: string;

  @Column({ type: 'tinyint', nullable: true })
  imap_ssl_enabled: boolean;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  imap_ssl_protocol: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  imap_folders: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  smtp_host: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  smtp_port: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  smtp_password: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  smtp_protocol: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  smtp_transport_strategy: string;

  @Column({ type: 'varchar', nullable: true })
  desk_id: string;

  @Column({ type: 'uuid', nullable: true })
  uuid: string;

  @Column({ default: false })
  isPartner: boolean;

  @Column({ nullable: true })
  partnerId: number;

  @Column({ nullable: true })
  weeklyCount: number;

  @OneToMany(
    () => OperatorDeskRel,
    (OperatorDeskRel) => OperatorDeskRel.operator,
  )
  operator_rel: OperatorDeskRel;

  @OneToMany(() => partner_kyc_documents, (kycNote) => kycNote.approvedBy)
  partnerApprovedBy: partner_kyc_documents[];

  @OneToMany(() => notifications, (notification) => notification.creator_id)
  creator_id: notifications[];

  @ManyToOne(() => FileEntity, {
    eager: true,
    nullable: true,
  })
  photo?: FileEntity | null;

  @OneToMany(() => AdminTask, (task) => task.assignTo)
  assignTo: AdminTask;

  @OneToMany(() => Office, (office) => office.managerOperator)
  managedOffices: Office[];

  @OneToOne(() => User, (user) => user.operator)
  user: User;

  @OneToMany(() => Lead, (lead) => lead.salesRep)
  leadOperator: Lead;

  @OneToMany(
    () => operator_targets,
    (operator_target) => operator_target.operator,
  )
  operator_targets: operator_targets[];

  @Column({ nullable: true, length: 'MAX' })
  speakingLanguage: string;

  @Column({ default: false })
  autoLeadAssign: boolean;

  @Column({ default: false })
  autoMonthlyTarget: boolean;

  @Column({ default: 0 })
  retentionWeeklyCount: number;

  @Column({ default: false })
  autoClientAssign: boolean;

  @Column({ default: 0 })
  assignmentPriority: number;

  @Column({ type: 'datetime', nullable: true })
  availabilityStartTime: Date;

  @Column({ type: 'datetime', nullable: true })
  availabilityEndTime: Date;

  @Column({ default: 0 })
  leadReassignWeeklyCount: number;

  @Column({ default: false })
  autoLeadReassign: boolean;

  @Column({ default: true })
  isFirstLogin: boolean;
}
