import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Partner } from './partner.entity';
import { Regulations } from 'src/admin/regulations/entities/regulations.entity';

@Entity()
export class PartnerTradingGroups {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Partner, (partner) => partner.tradingGroup, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'partnerId' })
  partner: Partner;

  // @Column()
  // tradingGroup: string;

  // @Column()
  // tradingGroupSw: string;

  // @Column({ nullable: true })
  // copyTradingGroup: string;

  // @Column()
  // copyTradingGroupSw: string;

  // @Column({ nullable: true })
  // premierTradingGroup: string;

  // @Column()
  // premierTradingGroupSw: string;

  // @Column({ nullable: true })
  // eliteTradingGroup: string;

  // @Column()
  // eliteTradingGroupSw: string;

  @Column()
  office: number;

  @Column()
  salesDesk: number;

  @Column()
  retentionDesk: number;

  @Column()
  supportDesk: number;

  @Column()
  financeDesk: number;

  @Column()
  kycDesk: number;

  @Column({ nullable: true })
  salesRep: number;

  @Column({ nullable: true })
  retentionRep: number;

  @ManyToOne(() => Regulations, { nullable: true })
  @JoinColumn({ name: 'regulationId', referencedColumnName: 'id' })
  regulation: Regulations;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
