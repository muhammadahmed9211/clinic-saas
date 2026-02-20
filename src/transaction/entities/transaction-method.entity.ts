import { EntityHelper } from 'src/utils/entity-helper';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany
} from 'typeorm';
import { TransactionMethodRegulations } from './transaction-method-regulation.entity';
import { SinglePaymentMethod } from '../dto/create-transaction.dto';

export enum Methods {
  CREDIT_CARD = 'CREDIT_CARD',
  WIRE = 'WIRE',
  MIGRATION = 'MIGRATION',
  INTERNAL_TRANSFER = 'INTERNAL_TRANSFER',
  EXTERNAL_EXCHANGE = 'EXTERNAL_EXCHANGE',
  NONE = 'NONE',
  EXCHANGE = 'EXCHANGE',
  E_WALLET = 'E_WALLET',
  CRYPTO = 'CRYPTO',
}

type MethodsMapperType = {
  [key in Methods]: string;
};

export const MethodsMapper: MethodsMapperType = {
  [Methods.CREDIT_CARD]: 'Credit Card',
  [Methods.WIRE]: 'Bank Transfer',
  [Methods.MIGRATION]: 'Migration',
  [Methods.INTERNAL_TRANSFER]: 'Internal Transfer',
  [Methods.EXTERNAL_EXCHANGE]: 'External Exchange',
  [Methods.NONE]: 'None',
  [Methods.EXCHANGE]: 'Exchange',
  [Methods.E_WALLET]: 'E Wallet',
  [Methods.CRYPTO]: 'Crypto',
}

export const SinglePaymentMethodWrapper = {
  [SinglePaymentMethod.credit_card]:Methods.CREDIT_CARD,
  [SinglePaymentMethod.crypto]:Methods.CRYPTO,
  [SinglePaymentMethod.apm]:Methods.E_WALLET,
}

@Entity()
export class TransactionMethod extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'simple-enum' })
  method: Methods;

  @Column({ default: true })
  isActive: boolean;

  
  @Column({ type: 'nvarchar', default: 'AMOUNT' })
  depositFeeType: string;

  @Column({ type: 'float', default: 0 })
  depositFeeStart: number;

  @Column({ type: 'float', default: 0 })
  depositFeeEnd: number;

  @Column({ type: 'nvarchar', default: 'AMOUNT' })
  withdrawalFeeType: string;

  @Column({ type: 'float', default: 0 })
  withdrawalFeeStart: number;

  @Column({ type: 'float', default: 0 })
  withdrawalFeeEnd: number;

  @Column({ type: 'nvarchar', default: 'AMOUNT' })
  clientDepositFeeType: string;

  @Column({ type: 'float', default: 0 })
  clientDepositFeeStart: number;

  @Column({ type: 'float', default: 0 })
  clientDepositFeeEnd: number;

  @Column({ type: 'nvarchar', default: 'AMOUNT' })
  clientWithdrawalFeeType: string;

  @Column({ type: 'float', default: 0 })
  clientWithdrawalFeeStart: number;

  @Column({ type: 'float', default: 0 })
  clientWithdrawalFeeEnd: number;

  @Column({ type: 'float', default: 0 })
  depositLimit: number;

  @Column({ type: 'float', default: 0 })
  withdrawalLimit: number;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => TransactionMethodRegulations, (regulations) => regulations.method)
  regulations: TransactionMethodRegulations[];

}
