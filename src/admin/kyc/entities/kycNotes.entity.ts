import { LeadsCallLog } from 'src/admin/leads-call-logs/entities/leads-call-log.entity';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import { Meetings } from 'src/admin/leads/meetings/entities/meetings.entity';
import { Opportunity } from 'src/admin/leads/opportunity/entities/opportunity.entity';
import { partner_kyc_documents } from 'src/admin/partner-kyc-docs/entities/partner_kyc_docs.entity';
import { Partner } from 'src/settings/entities/partner.entity';
import { Tickets } from 'src/ticket-management/entities/tickets.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { user_kyc_documents } from 'src/user-kyc-docs/entities/user-kyc-documents.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class notes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user_id: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  created_by: User;

  @ManyToOne(() => Partner, { eager: true, nullable: true })
  @JoinColumn({ name: 'partner_id', referencedColumnName: 'id' })
  partner_id: Partner;

  @ManyToOne(() => Opportunity, { nullable: true })
  @JoinColumn({ name: 'opportunity_id', referencedColumnName: 'id' })
  opportunity_id: Opportunity;

  @ManyToOne(() => LeadsCallLog, { nullable: true })
  @JoinColumn({ name: 'call_id', referencedColumnName: 'id' })
  call_id: LeadsCallLog;

  @ManyToOne(() => Meetings, { nullable: true })
  @JoinColumn({ name: 'meeting_id', referencedColumnName: 'id' })
  meeting_id: Meetings;

  @ManyToOne(() => Lead, { nullable: true })
  @JoinColumn({ name: 'lead_id', referencedColumnName: 'id' })
  lead_id: Lead;

  @ManyToOne(() => Tickets, { nullable: true })
  ticket: Tickets;

  @ManyToOne(() => user_kyc_documents, { eager: true, nullable: true })
  @JoinColumn({ name: 'user_kyc_document_id', referencedColumnName: 'id' })
  user_kyc_document_id: user_kyc_documents;

  @ManyToOne(() => Transaction, { nullable: true })
  transaction: Transaction;

  @ManyToOne(() => partner_kyc_documents, { eager: true, nullable: true })
  @JoinColumn({ name: 'partner_kyc_document_id', referencedColumnName: 'id' })
  partner_kyc_document_id: partner_kyc_documents;

  @Column('uuid', { nullable: true })
  file_id: string;

  @Column({ type: 'nvarchar', length: 'max' })
  note: string;

  @Column()
  type: string;

  @Column()
  isPublic: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @Column({ nullable: true })
  relatedToId: number;

  @Column({ nullable: true, type: 'nvarchar', length: 'max' })
  relatedToName: string;

  //Plain variable for custom response
  attchementUrl: string;

  fileName: string;
}
