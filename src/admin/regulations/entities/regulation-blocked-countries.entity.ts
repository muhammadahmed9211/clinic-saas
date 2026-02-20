import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Regulations } from './regulations.entity';
import { RegulationsCountries } from './regulations-countries.entity';

@Entity()
export class RegulationBlockedCountries {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Regulations, { onDelete: 'CASCADE' })
    regulation: Regulations;

    @ManyToOne(() => RegulationsCountries, (regulationCountry) => regulationCountry.id, {
        onDelete: 'CASCADE',
    })
    country: RegulationsCountries;
}
