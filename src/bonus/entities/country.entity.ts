import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Bonus } from './bonus.entity';

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  // @ManyToMany(() => Bonus, (bonus) => bonus.countries)
  // bonuses: Bonus[];
}
