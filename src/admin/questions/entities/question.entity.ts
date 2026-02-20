import { LeadAnswer } from 'src/admin/leads/entities/lead-answer.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class LeadQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column()
  description: string;

  @Column()
  dataType: string;

  @OneToMany(() => LeadAnswer, (answer) => answer.question)
  answers: LeadAnswer[];

  @Column({ unique: true })
  @Index()
  key: string;

  @ManyToOne(() => User)
  createdBy: User;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
