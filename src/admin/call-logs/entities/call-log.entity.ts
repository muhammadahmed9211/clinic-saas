import { CustomStatus } from 'src/admin/client/entities/custom_status.entity';
import { User } from 'src/users/entities/user.entity';
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

export enum CallToUserType {
  LEAD = 'lead',
  APPLICANT = 'applicant',
  CLIENT = 'client',
}
export enum CallType {
  OUTBOUND = 'outbound',
  INBOUND = 'inbound',
  MISSED = 'missed',
}

export enum RelatedTo {
  CLIENT = 'client',
  TRANSACTION = 'transaction',
  DEAL = 'deal',
}

@Entity()
export class CallLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  callToUserType: CallToUserType;

  @Column({ type: 'varchar' })
  callToUserName: string;

  @Column({ type: 'varchar' })
  releatedTo: RelatedTo;

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

  @Column({ type: 'varchar' })
  subject: string;

  @Column({ type: 'varchar' })
  callAgenda: string;

  @ManyToOne(() => CustomStatus)
  @JoinColumn({ name: 'callResults' })
  callResults: CustomStatus;

  @Column({ type: 'varchar' })
  description: string;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
