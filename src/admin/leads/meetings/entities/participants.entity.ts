import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Meetings } from './meetings.entity';
import { Lead } from '../../entities/lead.entity';

@Entity()
export class MeetingParticipants {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lead)
  participant: Lead;

  @ManyToOne(() => Meetings)
  meeting: Meetings;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
