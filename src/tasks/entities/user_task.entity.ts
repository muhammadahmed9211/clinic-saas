import { EntityHelper } from 'src/utils/entity-helper';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Label } from './label.entity';
import { MasterTask } from './master_task.entity';

@Entity()
export class UserTask extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  dateTime: Date;

  @Column({ nullable: true })
  dueDateTime: Date;

  @Column({ default: false })
  isForced: boolean;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  url: string;

  @ManyToOne(() => Label, { onDelete: 'CASCADE' })
  label: Label;

  @ManyToOne(() => MasterTask, { onDelete: 'CASCADE' })
  task: MasterTask;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
