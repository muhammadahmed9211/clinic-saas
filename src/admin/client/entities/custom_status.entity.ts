// communication.entity.ts

import { CallLog } from 'src/admin/call-logs/entities/call-log.entity';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import { partner_kyc_documents } from 'src/admin/partner-kyc-docs/entities/partner_kyc_docs.entity';
import { ActivityReport } from 'src/reports/entities/activityReport.entity';
import { user_kyc_documents } from 'src/user-kyc-docs/entities/user-kyc-documents.entity';
import { Client } from 'src/users/entities/client.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum StatusType {
  Sales = 'sales',
  Retention = 'retention',
  Client_Potential = 'client_potential',
  Audit_Status = 'audit_status',
  Kyc_Status = 'kyc_status',
  System = 'system',
  Regulations = 'regulations',
  Client_type = 'client_type',
  CALL_RESULTS = 'call_results',
  LEADS = 'lead',
  REPORT_ACTIVITY = 'report_activity',
  DASHBOARD='dashboard'
}

@Entity()
export class CustomStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'simple-enum', enum: StatusType })
  type: StatusType;

  @Column()
  sort: number;

  @Column({ default: false })
  is_hidden: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Client, (client) => client.customSaleStatus)
  clientSales: Client;

  @OneToMany(() => Client, (client) => client.customRetentionStatus)
  clientRetention: Client;

  @OneToMany(() => Client, (client) => client.customAuditStatus)
  clientAudit: Client;

  @OneToMany(() => Client, (client) => client.customClientPotential)
  clientPotential: Client;

  @OneToMany(() => Client, (client) => client.customKycStatus)
  clientKycStatus: Client;

  @OneToMany(() => user_kyc_documents, (client) => client.customKycStatus)
  userKycStatus: user_kyc_documents;

  @OneToMany(() => partner_kyc_documents, (client) => client.customKycStatus)
  partnerKycStatus: partner_kyc_documents;

  @OneToMany(() => CallLog, (callLog) => callLog.callResults)
  callLogCallResults: CallLog;

  @OneToMany(() => Lead, (lead) => lead.leadStatus)
  leadCustomStatus: Lead;

  @OneToMany(() => Lead, (lead) => lead.salesStatus)
  leadSales: Lead;

  @OneToMany(() => ActivityReport, (activityReport) => activityReport.status)
  activityReports: ActivityReport[];
}
