import { Classification } from 'src/classification/entities/classification.entity';
import { IbCommissionProfileConfig } from 'src/ib/ib_config/entities/ib_commission_profile_config.entity';
import { Partner } from 'src/settings/entities/partner.entity';
import { TradingGroup } from 'src/trading-group/entities/trading-group.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommissionProfileKeyFeature } from './ib_commission_profile_key_features.entity';

@Entity()
export class IbCommissionProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  classificationId: number;

  @ManyToOne(() => Classification)
  @JoinColumn({ name: 'classificationId' })
  classification: Classification;

  @ManyToOne(() => TradingGroup)
  tradingGroup: TradingGroup;

  @ManyToOne(() => TradingGroup)
  copyTradingGroup: TradingGroup;

  @ManyToOne(() => TradingGroup)
  agentTradingGroup: TradingGroup;

  @Column()
  level: number;

  @Column({ nullable: true })
  server: string;

  @Column({ default: false })
  calculateCommission: boolean;

  @ManyToOne(() => User)
  createdBy: User;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isPublic: boolean;

  @OneToMany(() => IbCommissionProfileConfig, (config) => config.commissionProfile)
  configs: IbCommissionProfileConfig[];

  @OneToMany(() => Partner, (partner) => partner.commissionProfile, { nullable: true })
  partner: Partner

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Column()
  standardTradingGroup: string

  @Column()
  premierTradingGroup: string

  @Column()
  eliteTradingGroup: string

  @OneToMany(
    () => CommissionProfileKeyFeature,
    (feature) => feature.commissionProfile,
    { cascade: true },
  )
  keyFeatures: CommissionProfileKeyFeature[];
}
