import { IbCommissionProfileConfig } from './ib_commission_profile_config.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn, DeleteDateColumn, OneToMany, } from 'typeorm';
import { IbDistributionValue } from './ib_distribution_value.entity';

@Entity()
export class IbDistribution {
    @PrimaryGeneratedColumn()
    id: number;

    // Add many-to-one relationship to IbProfileConfig
    @ManyToOne(() => IbCommissionProfileConfig, (config) => config.distributions)
    distribution: IbCommissionProfileConfig;


    @OneToMany(() => IbDistributionValue, (distributionValue) => distributionValue.distribution)
    distributionValues: IbDistributionValue[];

    @Column()
    key: string;

    @Column()
    value: string;

    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;
}