import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { IbDistribution } from './ib_distribution.entity';
import { IbDistributionValue } from './ib_distribution_value.entity';
import { IbCommissionProfile } from 'src/ib/ib_profile/entities/ib_commission_profile.entity';
import { IbCommissionProfileType } from 'src/ib/ib_profile/entities/ib_commission_profile_type.entity';


@Entity()
export class IbCommissionProfileConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  priority: number;

  @ManyToOne(() => IbCommissionProfile)
  commissionProfile: IbCommissionProfile;

  @ManyToOne(() => IbCommissionProfileType)
  profileType: IbCommissionProfileType;

  //Cashback toggle
  @Column({ nullable: true })
  setCashback: boolean;

  @Column({ nullable: true })
  isDeductFromIb: boolean;

  @Column({ nullable: true })
  cashbackAmountType: string;

  @Column({ nullable: true })
  cashbackAmount: string;

  @Column({ nullable: true })
  symbols: string;

  @Column({ nullable: true })
  entry: string;

  // Add one-to-many relationship to Distribution
  @OneToMany(() => IbDistribution, (distribution) => distribution.distribution, {
    cascade: true,
  })
  distributions: IbDistribution[];

  // // Add one-to-many relationship to Distribution
  // @OneToMany(
  //   () => IbDistributionValue,
  //   (amountDistribution) => amountDistribution.configuration,
  //   {
  //     cascade: true,
  //   },
  // )
  // amountDistributions: IbDistributionValue[];

  @Column({ nullable: true })
  scalpingTrades: string;

  @ManyToOne(() => User)
  createdBy: User;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
