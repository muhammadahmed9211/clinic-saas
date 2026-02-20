import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { RegulationEventRuleMapping } from './regulation-event-rule-mapping.entity';
import { User } from 'src/users/entities/user.entity';

export enum RegulationEventKeys {
  mt5_live_account_creation = 'mt5_live_account_creation',
  withdrawal_creation = 'withdrawal_creation',
  deposit_creation = 'deposit_creation',
}

@Entity()
export class RegulationEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['key'])
  key: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, { nullable: true })
  createdBy: User;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => RegulationEventRuleMapping,
    (regulationRule) => regulationRule.event,
  )
  regulationRule: RegulationEventRuleMapping;
}
