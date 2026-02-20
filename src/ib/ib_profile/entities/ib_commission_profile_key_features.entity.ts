import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IbCommissionProfile } from './ib_commission_profile.entity';

@Entity()
export class CommissionProfileKeyFeature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  feature: string;

  @ManyToOne(() => IbCommissionProfile)
  commissionProfile: IbCommissionProfile;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

}
