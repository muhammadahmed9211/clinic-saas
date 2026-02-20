import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    Column,
    Entity,
    OneToOne,
  } from 'typeorm';
  import { BankAccount } from './bank-account.entity';
  import { Regulations } from 'src/admin/regulations/entities/regulations.entity';
  
  @Entity()
  export class BankAccountRegulations {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => BankAccount, { nullable: false })
    bankAccount: BankAccount;
  
    @ManyToOne(() => Regulations, { nullable: false })
    regulation: Regulations;
  
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;
  
    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
  }