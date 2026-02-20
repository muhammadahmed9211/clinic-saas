import {
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
import { MeetingParticipants } from './participants.entity';
import { Lead } from '../../entities/lead.entity';
import { attachments } from '../../opportunity/entities/attachment.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';

@Entity()
export class Meetings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'nvarchar' })
  title: string;

  @Column({ nullable: true, type: 'nvarchar' })
  location: string;

  @Column({ nullable: true })
  allDay: boolean;

  @Column({ nullable: true, type: 'datetime' })
  from: Date;

  @Column({ nullable: true, type: 'datetime' })
  to: Date;

  @Column({ nullable: true, type: 'nvarchar' })
  fromEmail: string;

  @Column({ nullable: true, type: 'nvarchar' })
  userTimezone: string;

  @ManyToOne(() => Operator)
  @JoinColumn()
  host: Operator;

  @ManyToOne(() => Operator)
  @JoinColumn()
  createdBy: Operator;

  @OneToMany(() => MeetingParticipants, (participants) => participants.meeting)
  participants: MeetingParticipants[];

  @OneToMany(() => attachments, (attachment) => attachment.meetingId)
  attachments: attachments[];

  @Column({ nullable: true })
  relatedToId: number;

  @ManyToOne(() => Lead)
  @JoinColumn()
  lead: Lead;

  @Column({ nullable: true, type: 'nvarchar' })
  notes: string;

  @Column({ nullable: true })
  opportunityID: number;

  @Column({ nullable: true, type: 'nvarchar' })
  status: string;

  @Column({ nullable: true })
  isDeleted: boolean;

  @Column({ nullable: true, type: 'nvarchar' })
  completionReason: string;

  @Column({ nullable: true, type: 'nvarchar' })
  cancelReason: string;

  @Column({ nullable: true, type: 'nvarchar' })
  deleteReason: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
