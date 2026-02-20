import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Column,
  Entity,
  JoinColumn,
} from 'typeorm';
import { Countries } from 'src/psp/entities/countries.entity';

@Entity()
export class Currencies {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 'MAX' })
  currency: string;

  @Column({ type: 'varchar', length: 100 })
  iso: string;

  @Column({ type: 'nvarchar', length: 100 })
  symbol: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  countryId: number;

  @Column({type:'float'})
  conversionRate: number;

  @Column({ type: 'nvarchar', length: 100, default:"USD" })
  conversionCurrency: string;

  @ManyToOne(() => Countries)
  @JoinColumn({ name: "countryId" })
  country: Countries

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}