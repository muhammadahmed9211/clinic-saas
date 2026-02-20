import { Currencies } from 'src/currencies/entities/currencies.entity';
import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Countries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column()
  currencyId: string;

  @ManyToOne(()=>Currencies)
  @JoinColumn({name:"currencyId"})
  currency: Currencies;

  @Column({ nullable: true })
  nameAr: string;

  @Column({ nullable: true })
  iso: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
