import { User } from 'src/users/entities/user.entity';
import { Server } from 'src/wallet/entities/server.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Mt5AccountsReplicated } from './mt5-accounts-replicated.entity';
import { Mt5UsersReplicated } from './mt5-users.entity';
import { Mt5AccountTradingType } from './mt5-account-trading-type.entity';
import { IbCommissionDeals } from 'src/ib/commission/entities/ib-comission-deals.entity';
import { IbCommissionProfile } from 'src/ib/ib_profile/entities/ib_commission_profile.entity';
import { TradingGroup } from 'src/trading-group/entities/trading-group.entity';

@Entity()
export class Mt5Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @ManyToOne(() => Server, { eager: true })
  server: Server;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ default: false }) //added default check
  isDefault: boolean;

  @JoinColumn()
  @ManyToOne(
    () => Mt5AccountTradingType,
    (tradingType) => tradingType.mt5Accounts, // Updated to match renamed property
    {
      eager: true,
      nullable: true,
      onDelete: 'SET NULL', // Added cascade behavior for consistency
    },
  )
  tradingType: Mt5AccountTradingType;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => Mt5AccountsReplicated)
  @JoinColumn({ name: 'login', referencedColumnName: 'login' }) // Join based on the login column
  mt5AccountsReplicated: Mt5AccountsReplicated;

  @OneToOne(() => Mt5UsersReplicated)
  @JoinColumn({ name: 'login', referencedColumnName: 'login' }) // Join based on the login column
  mt5UsersReplicated: Mt5UsersReplicated;

  @OneToMany(() => IbCommissionDeals, (deal) => deal.login)
  deals: IbCommissionDeals[];

  @ManyToOne(() => TradingGroup)
  group: TradingGroup;

  @JoinColumn({ name: 'commissionProfileId' })
  @ManyToOne(() => IbCommissionProfile)
  commissionProfile: IbCommissionProfile;

  @Column({ default: true })
  calculateCommission: boolean;
}
