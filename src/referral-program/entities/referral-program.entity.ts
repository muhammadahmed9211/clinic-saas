import { Label } from 'src/tasks/entities/label.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ReferralRule } from './referral-rule.entity';
import { Regulations } from 'src/admin/regulations/entities/regulations.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { FileEntity } from 'src/files/entities/file.entity';

export enum ReferralProgramStatus {
  ACTIVE = 'Active',
  IN_ACTIVE = 'In Active',
  DRAFT = 'Draft',  //default
}

export enum ReferralProgramType {
  SINGLE_TIER = 'Single Tier',
  MULTI_TIER = 'Multi Tier',
}

export enum RewardType {
  AMOUNT = 'Amount',
  PERCENTAGE = 'Percentage',
}

export enum IntervalType {
  MONTH='MONTH',
  DAY='DAY'
}

@Entity()
@Unique(['code', 'type'])
export class ReferralProgram {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => ReferralRule , (rule)=>rule.referralProgram)
  referralRule: ReferralRule[];

  @Column()
  status: string;

  @Column({ default: ReferralProgramType.SINGLE_TIER })
  type: string;

  @ManyToOne(() => FileEntity, { eager: true })
  @JoinColumn({ name: 'image' })
  image?: FileEntity | null;

  @Column()
  code: string;

  @Column()
  reward: number;

  @Column({ default: RewardType.AMOUNT })
  rewardType: number;

  @Column({ nullable: true })
  maximumReferrals: number;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  startDateTime: Date  | null;

  @Column({ type: 'datetime', nullable: true })
  endDateTime: Date | null;

  //WILL BE UPDATED 
  @Column('simple-array', { nullable: true })
  country: string[];

  @ManyToOne(() => Regulations , { nullable: true })
  @JoinColumn({ name: 'regulationId' })
  regulation: Regulations | null;


  @ManyToOne(() => LabelTranslation, { eager: true, nullable: true })
  @JoinColumn({ name: 'descriptionEn' })
  descriptionEn: LabelTranslation;

  @ManyToOne(() => LabelTranslation, { eager: true, nullable: true })
  @JoinColumn({ name: 'descriptionAr' })
  descriptionAr: LabelTranslation;

  @ManyToOne(() => LabelTranslation, { eager: true, nullable: true })
  @JoinColumn({ name: 'titleEn' })
  titleEn: LabelTranslation;

  @ManyToOne(() => LabelTranslation, { eager: true, nullable: true })
  @JoinColumn({ name: 'titleAr' })
  titleAr: LabelTranslation;

  @ManyToOne(() => Label, { nullable: true })
  @JoinColumn({ name: 'titleId' })
  title: Label;
  
  @ManyToOne(() => Label, { nullable: true })
  @JoinColumn({ name: 'descriptionId' })
  description: Label;

  @Column({ nullable: true })
  titleId: number;

  @Column({ nullable: true })
  descriptionId: number;

  @Column({default:1})
  intervalValue: number;

  @Column({default:IntervalType.MONTH})
  intervalType: string;

  // @Column({ nullable: false })
  // challengePeriod: number;
}
