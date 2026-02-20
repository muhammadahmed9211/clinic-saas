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
  Index,
} from 'typeorm';
import { Opportunity } from './opportunity.entity';
import { Lead } from '../../entities/lead.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { Meetings } from '../../meetings/entities/meetings.entity';

@Entity()
export class attachments {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Opportunity, { nullable: true })
  @JoinColumn({ name: 'opportunityId', referencedColumnName: 'id' })
  opportunityId: Opportunity;

  @ManyToOne(() => Meetings, { nullable: true })
  @JoinColumn({ name: 'meetingId', referencedColumnName: 'id' })
  meetingId: Meetings;

  @ManyToOne(() => User, {})
  @JoinColumn({ name: 'attachedBy', referencedColumnName: 'id' })
  attachedBy: User;

  @ManyToOne(() => Lead, { nullable: true })
  @JoinColumn({ name: 'leadId', referencedColumnName: 'id' })
  leadId: Lead;

  @Column('uuid')
  fileId: string;

  @Index()
  @ManyToOne(() => FileEntity, {})
  @JoinColumn({ name: 'fileId' })
  file: FileEntity;

  @Column()
  isPublic: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
