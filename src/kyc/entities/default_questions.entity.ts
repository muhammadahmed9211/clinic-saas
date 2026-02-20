import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Answer } from './default_answers.entity';
import { UserAnswer } from 'src/users/entities/user_kyc_answers.entity';
import { LanguageType } from 'src/users/entities/user.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  group: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true, length: 1000 })
  title: string;

  @Column({ nullable: true, length: 1000 })
  desc: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  step: number;

  @Column({ nullable: true })
  subStep: number;

  @Column({ nullable: true, default: 1 })
  sort: number;

  @Column({ nullable: true, default: null })
  shortTitle: string;

  @Column()
  isHidden: boolean;

  @Column()
  isRequired: boolean;

  @Column()
  isEditable: boolean;

  @Column({default:true})
  isWeightedQuestion: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({
    type: 'simple-enum',
    enum: LanguageType,
    default: LanguageType.English,
  })
  languageIso: LanguageType;

  @OneToMany(() => Answer, (answer) => answer.question, { cascade: true })
  answers: Answer[];

  @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.question)
  userAnswer: UserAnswer[];
}
