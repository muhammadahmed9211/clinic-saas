import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { EmailList } from './emailList.entity';
import { EmailStatus } from 'src/utils/enums/email-status.enum';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import { EmailAttachments } from './emailAttachments.entity';

@Entity()
export class InboxEmail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  messageId: string;

  @Column({ nullable: true })
  subject: string;

  @Column({ type: 'nvarchar', length: 'max', nullable: true })
  body: string;

  @Column({ nullable: true })
  from: string;

  @Column({ nullable: true })
  receivedDateTime: Date;

  @Column({ nullable: true })
  senderName: string;

  @Column()
  emailId: number;

  @ManyToOne(() => EmailList, { nullable: true })
  @JoinColumn({ foreignKeyConstraintName: 'emailId' })
  email: EmailList;

  @Column({ default: EmailStatus.READ })
  status: string;

  @Column({ nullable: true })
  leadId: number;

  @ManyToOne(() => Lead, { nullable: true })
  @JoinColumn({ foreignKeyConstraintName: 'leadId' })
  lead: Lead;


}
