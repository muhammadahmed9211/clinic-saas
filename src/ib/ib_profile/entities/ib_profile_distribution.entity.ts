import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from 'typeorm';
import { IbCommissionProfileType } from './ib_commission_profile_type.entity';

@Entity('ib_profile_distribution')
export class IbProfileDistribution {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => IbCommissionProfileType, (profileType) => profileType.distributions)
    profileType: IbCommissionProfileType;

    @Column()
    name: string;

    @CreateDateColumn({ type: 'datetime', default: () => 'GETDATE()' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime', default: () => 'GETDATE()' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'datetime2', nullable: true })
    deletedAt: Date;
}