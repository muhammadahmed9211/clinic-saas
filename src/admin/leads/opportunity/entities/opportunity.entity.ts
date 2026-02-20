import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';
import { attachments } from './attachment.entity';

@Entity()
export class Opportunity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Operator)
  dealOwner: Operator; // Operator relation

  @Column()
  dealName: string;

  @Column()
  companyName: string;

  @Column()
  nextStep: string;

  @Column()
  leadSource: string;

  @ManyToOne(() => User, { nullable: true })
  contactName: User; // client relation

  @Column({ nullable: true })
  contact: string; // client relation

  @Column()
  closingDate: Date;

  @Column()
  stage: string;

  @Column()
  probability: string;

  @Column({ type: 'float' })
  expectedInvestment: number;

  @Column()
  typeOfBusiness: string;

  @ManyToOne(() => Lead)
  lead: Lead;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User)
  createdBy: User;

  @ManyToOne(() => User)
  ModifiedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => attachments, (attachment) => attachment.opportunityId)
  attachments: attachments[];

  // @OneToMany(() => LeadsCallLog, (LeadsCallLog) => LeadsCallLog.opportunity)
  // leadsCallLog: LeadsCallLog;
}
