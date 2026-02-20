import { Question } from 'src/kyc/entities/default_questions.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class UserAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  questionId: number;

  @Column({ nullable: true })
  answerId: number;

  @Column({
    type: 'nvarchar',
    length: 'MAX',
    collation: 'SQL_Latin1_General_CP1_CI_AS',
  })
  answerText: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Question, (question) => question.answers, {
    eager: true,
  })
  @JoinColumn({ name: 'questionId', referencedColumnName: 'id' })
  question: Partial<Question>;
}
