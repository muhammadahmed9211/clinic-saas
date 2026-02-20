import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { SupportedCrypto } from './supported-crypto.entity';

@Entity()
export class CryptoNetwork {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  network: string;

  @Column({ nullable: true })
  standard: string;

  @Column({ default: true })
  isDepositSupported: boolean;

  @Column({ type: 'nvarchar', nullable: true, length: 'MAX' })
  url: string;

  @ManyToOne(() => SupportedCrypto, { nullable: false })
  crypto: SupportedCrypto;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
