import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Entity,
} from 'typeorm';
import { BankAccount } from './bank-account.entity';
import { Countries } from 'src/psp/entities/countries.entity';

@Entity()
export class BankAccountCountries {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BankAccount, { nullable: false })
  bankAccount: BankAccount;

  @ManyToOne(() => Countries)
  country: Countries;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}