import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { CryptoNetwork } from './crypto-network.entity';

@Entity()
export class  SupportedCrypto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  coin: string;

  @Column({ default: true })
  isDepositSupported: boolean;

  @Column({ type: 'nvarchar', nullable: true, length: 'MAX' })
  url: string;

  @OneToMany(() => CryptoNetwork, (network) => network.crypto)
  networks: CryptoNetwork[];

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
