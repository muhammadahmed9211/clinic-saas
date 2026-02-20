import {
  CallToUserType,
  CallType,
} from 'src/admin/call-logs/entities/call-log.entity';
import { CustomStatus } from 'src/admin/client/entities/custom_status.entity';
import { Lead } from 'src/admin/leads/entities/lead.entity';
// import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class LeadsCallLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  callToUserType: CallToUserType;

  @Column({ type: 'varchar' })
  callToUserName: string;

  @Column({ type: 'varchar' })
  releatedTo: string;

  @Column({ type: 'varchar' })
  callType: CallType;

  @Column({ type: 'varchar' })
  outgoingCallStatus: string;

  @Column({ nullable: true })
  callStartDateTime: Date;

  @Column({ nullable: true })
  callEndDateTime: Date;

  @Column({ nullable: true, type: 'varchar' })
  callDuration: string;

  @Column({ type: 'varchar' })
  callOwner: string;

  @Column({ nullable: true })
  callOwnerId: number;

  @Column({ type: 'varchar' })
  subject: string;

  @Column({ type: 'varchar' })
  callAgenda: string;

  @ManyToOne(() => CustomStatus)
  @JoinColumn({ name: 'callResults' })
  callResults: CustomStatus;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar', default: null })
  agentExt: string;

  @Column({ type: 'varchar', default: null })
  agentName: string;

  @ManyToOne(() => Lead, (lead) => lead.leadsCallLog)
  lead: Lead;

  @Column({ nullable: true })
  opportunityID: number;
  // @ManyToOne(() => Opportunity, (opportunity) => opportunity.leadsCallLog)
  // opportunity: Opportunity;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
