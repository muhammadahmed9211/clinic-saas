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

export enum RegulationRuleKeys {
  on_ftd = 'on_ftd',
  kyc_approved = 'kyc_approved',
  proof_of_payment = 'proof_of_payment',
  on_kyc_approval = 'on_kyc_approval',
  is_kyc_required = 'is_kyc_required',
  is_ftd_required = 'is_ftd_required',
}

export enum RegulationRuleType {
  BOOLEAN = 'boolean',
  STRING = 'string',
  NUMBER = 'number',
  DATE = 'date',
}

@Entity()
export class RegulationRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    default: RegulationRuleType.BOOLEAN,
  })
  type: string;

  @Column()
  @Unique(['key'])
  key: string;

  @Column()
  label: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  enumValue: string;

  @Column()
  defaultValue: string;

  @ManyToOne(() => User, { nullable: true })
  createdBy: User;

  @Column({ default: false })
  isDeleted: boolean;

  @OneToMany(
    () => RegulationEventRuleMapping,
    (regulationEvent) => regulationEvent.rule,
  )
  regulationEvent: RegulationEventRuleMapping;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
