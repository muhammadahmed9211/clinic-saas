import { FileEntity } from 'src/files/entities/file.entity';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Column,
  Entity,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BankAccountRegulations } from './bank-account-regulation.entity';
import { BankAccountCountries } from './bank-account-countries.entity';
import { BankAccountMethods } from './bank-account-methods.entity';
import { Currencies } from 'src/currencies/entities/currencies.entity';
import { Countries } from 'src/psp/entities/countries.entity';

export enum RestrictionType {
  Include = 'Include',
  Exclude = 'Exclude'
}

@Entity()
export class BankAccount {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  currencyId: number

  @ManyToOne(() => Currencies , {eager:true})
  @JoinColumn({ name: "currencyId" })
  bankCurrency: Currencies;

  @Column({ type: 'varchar', length: 100 })
  accountName: string;

  @Column({ type: 'varchar', length: 100 })
  currency: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  iban: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  swift: string;

  @Column({ type: 'varchar', length: 100 })
  bankName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bankAddress: string;

  @Column({ type: 'varchar', length: 100 })
  additionalInformation: string;

  @Column({ type: 'varchar', length: 100 })
  reference: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  accountNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  companyAddress: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  intermediateBankName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sortCode: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  branchCode: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  zipCode: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  branchName: string;

   @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ default: true })
  isClientVisible: boolean;

  @Column({ default: true })
  isRegulationRestricted: boolean;

  @Column({ default: true })
  isCountryRestricted: boolean;

  @Column({ default: true })
  isLocalMethodsEnable: boolean;

  @Column({ default: RestrictionType.Include })
  regulationRestrictionType: string;

  @Column({ default: RestrictionType.Include })
  countryRestrictionType: string;

  @OneToMany(
    () => BankAccountRegulations,
    (regulations) => regulations.bankAccount,
  )
  regulations: BankAccountRegulations[];

  @OneToMany(
    () => BankAccountCountries,
    (countries) => countries.bankAccount,
  )
  countries: BankAccountCountries[];

  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  logo: FileEntity | null;

  @OneToMany(() => BankAccountMethods, (m) => m.bankAccount)
  methods: BankAccountMethods[];

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}