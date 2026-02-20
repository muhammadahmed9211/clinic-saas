import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Entity,
  Column,
  JoinColumn,
} from 'typeorm';
import { BankAccount } from './bank-account.entity';
import { FileEntity } from 'src/files/entities/file.entity';

@Entity()
export class BankAccountMethods {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BankAccount, { nullable: false })
  bankAccount: BankAccount;

  @Column()
  logoId: string;

  @ManyToOne(() => FileEntity)
  @JoinColumn({ name: "logoId" })
  logo: FileEntity | null;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}