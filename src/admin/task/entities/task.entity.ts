import { Expose } from 'class-transformer';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import { Client } from 'src/users/entities/client.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TaskEntityType {
  GENERAL = 'general',
  CLIENT = 'client',
  OPERATOR = 'operator',
  PARTNER = 'partner',
  TRANSACTION = 'transaction',
  LEAD = 'lead',
  OPPORTUNITY = 'opportunity',
}

export enum RepeatType {
  NEVER = 'never',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export enum RepeatIntervalType {
  NEVER = 'never',
  AFTER = 'after',
  ON = 'on',
}

@Entity()
@Check(
  `"entity" IN ('general','client','operator','partner', 'transaction', 'lead', 'opportunity')`,
)
export class AdminTask {
  @PrimaryGeneratedColumn()
  id: number;

  @BeforeInsert()
  @BeforeUpdate()
  setLead() {
    if (this.entity === 'lead' && this.entityId) {
      this.leadId = Number(this.entityId);
    }
  }

  @Column({ nullable: true })
  relatedTo: string;

  @Column({ nullable: true })
  relatedToId: number;

  @Column({
    type: 'varchar',
    default: TaskEntityType.GENERAL,
  })
  entity: TaskEntityType;

  @Column()
  entityId: string;

  @ManyToOne(() => User, { nullable: true })
  assignTo: User;

  @ManyToOne(() => User, { nullable: true })
  createdBy: User;

  @Column()
  status: string;

  @Column({ nullable: true })
  leadId: number;

  @ManyToOne(() => Lead, { nullable: true })
  @JoinColumn({ foreignKeyConstraintName: 'leadId' })
  lead: Lead;

  @Column()
  previousStatus: string;

  @Column()
  subject: string;

  @Column()
  description: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column()
  dueDate: Date;

  @Column()
  priority: string;

  @Column({ nullable: true })
  reminder: Date;

  @Column({ nullable: true })
  remindBefore: number;

  @Column({ type: 'varchar', enum: RepeatType, default: RepeatType.NEVER })
  repeat: RepeatType;

  @Column({
    type: 'varchar',
    enum: RepeatIntervalType,
    default: RepeatIntervalType.NEVER,
  })
  repeatIntervalType: RepeatIntervalType;

  @Column({ type: 'int', nullable: true })
  after: number | null;

  @Column({ type: 'date', nullable: true })
  on: Date | null;

  @ManyToOne(() => Lead, { nullable: true })
  contact: Lead | null;

  @OneToOne(() => Client, { nullable: true })
  client: Client;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
