// communication.entity.ts
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import { Template } from 'src/mail/entities/template.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum CommunicationType {
  Email = 'email',
  SMS = 'sms',
  WhatsApp = 'whatsapp',
}

@Entity()
export class Communication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  message_id: string;

  @Column({ type: 'text', nullable: true })
  text: string;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  html: string;

  @Column({
    type: 'nvarchar',
    length: 'MAX',
    collation: 'SQL_Latin1_General_CP1_CI_AS',
    nullable: true,
  })
  subject: string;

  @Column({ type: 'simple-enum', enum: CommunicationType, nullable: true })
  type: CommunicationType;

  @Column({ nullable: true })
  sender: string;

  @Column({ nullable: true })
  from: string;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  leadId: number;

  @ManyToOne(() => Lead, { nullable: true })
  @JoinColumn({ name: 'leadId', referencedColumnName: 'id' })
  lead: Lead | null;

  @Column({ nullable: true })
  opportunityId: number;

  @Column({ type: 'bigint', nullable: true })
  operatorId: number;

  @ManyToOne(() => Operator, { nullable: true })
  @JoinColumn({ name: 'operatorId'})
  operator: Operator;

  @Column({ nullable: true })
  updatedById: number;

  @ManyToOne(() => Operator)
  @JoinColumn({ name: 'updatedById'})
  updatedBy: Operator;

  @ManyToOne(() => Template, { nullable: true })
  @JoinColumn({ name: 'template_id', referencedColumnName: 'id' })
  template: Template | null;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ default: 'Pending' })
  status: string;

  @Column({ default: false })
  starred: boolean;

  @Column({ default: false })
  read: boolean;

  @Column({ nullable: true })
  read_at: Date;

  @Column({ default: false })
  is_delivered: boolean;

  @Column({ nullable: true })
  sg_message_id: string;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Column({ nullable: true })
  email_event_name:string;
}
