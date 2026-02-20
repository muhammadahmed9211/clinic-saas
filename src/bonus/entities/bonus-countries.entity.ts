import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Bonus } from './bonus.entity';
import { Countries } from 'src/psp/entities/countries.entity';

@Entity('bonus_countries')
@Index(['bonusId', 'countryId'], { unique: true })
export class BonusCountries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bonusId: number;

  @Column()
  countryId: number;

  @ManyToOne(() => Bonus, (bonus) => bonus.bonusCountries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bonusId' })
  bonus: Bonus;

  @ManyToOne(() => Countries)
  @JoinColumn({ name: 'countryId' })
  country: Countries;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true }) 
  deletedAt: Date;

}