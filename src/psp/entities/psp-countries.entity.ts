import {
  Column,
  Entity,
  ManyToOne,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Countries } from './countries.entity';
import { PSP } from 'src/transaction/entities/psp.entity';

@Entity()
export class PspCountries {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Countries)
  country: Countries;

  @ManyToOne(() => PSP)
  psp: PSP;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  iso: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
