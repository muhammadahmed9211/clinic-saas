import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany,
    JoinColumn,
    DeleteDateColumn,
} from 'typeorm';
import { IbDistribution } from './ib_distribution.entity';

@Entity()
export class IbDistributionValue {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => IbDistribution, (distribution) => distribution.distribution)
    distribution: IbDistribution;

    @Column()
    distributionLevel: number;

    @Column()
    distributionAmount: string;

    @Column({ nullable: true })
    level: string;

    @Column({ nullable: true })
    fromAmount: string;

    @Column({ nullable: true })
    toAmount: string;

    @Column({ nullable: true })
    amount: string;

    @Column()
    distributionContext: string;

    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;

}