import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { IbCommissionProfile } from 'src/ib/ib_profile/entities/ib_commission_profile.entity';
import { Partner } from './partner.entity';


@Entity()
export class PartnerCommissionProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Partner, { eager: true })
  partner: Partner;

  @ManyToOne(() => IbCommissionProfile)
  commissionProfile: IbCommissionProfile;
}
