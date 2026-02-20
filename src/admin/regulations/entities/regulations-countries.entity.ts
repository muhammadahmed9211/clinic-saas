import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Regulations } from './regulations.entity';

@Entity()
export class RegulationsCountries {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    countryCode: string;

    @Column()
    telephonePrefix: number;

    @ManyToOne(() => Regulations)
    @JoinColumn()
    regulation: Regulations;

}