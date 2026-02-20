import { BonusReward } from 'src/transaction/entities/bonus-reward.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Label } from 'src/tasks/entities/label.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { DepositType, AccountClassification } from '../enum/bonus.enum';
import { Currencies } from 'src/currencies/entities/currencies.entity';
import { BonusCountries } from './bonus-countries.entity';

@Entity()
export class Bonus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  bonusCode: string;

  @Column({ nullable: true })
  minimumAmount: number;

  @Column()
  bonusAmount: number;

  @Column()
  currencyId: number;

  @ManyToOne(() => Currencies , {eager:true})
  @JoinColumn({ name: "currencyId" })
  currency: Currencies;

  @OneToMany(() => BonusReward, (bonusReward) => bonusReward.bonus)
  bonusReward: BonusReward[];
  
  @OneToMany(() => BonusCountries, (bonusCountries) => bonusCountries.bonus)
  bonusCountries:BonusCountries[]

  @Column()
  isActive: boolean;

  @Column({ type: 'nvarchar', nullable: true })
  regulations: string;

  @Column({ type: 'varchar', length: 50 })
  depositType: DepositType;

  @Column({ type: 'datetime2', nullable: true })
  startDateTime: Date;

  @Column({ type: 'datetime2', nullable: true })
  endDateTime: Date;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Column()
  titleId: number;

  @Column()
  descriptionId: number;

  @ManyToOne(() => Label, { eager: true })
  @JoinColumn({ name: 'titleId' })
  title: Label;

  @Column({ type: 'nvarchar', length: 50, default: AccountClassification.STANDARD })
  accountClassification: AccountClassification;

  @ManyToOne(() => Label, { eager: true })
  @JoinColumn({ name: 'descriptionId' })
  description: Label;

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
}