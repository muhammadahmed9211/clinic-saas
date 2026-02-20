import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OtpTypes {
  refresh = 'refresh',
  reset_password = 'reset_password',
  verify_email = 'verify_email',
  verify_mobile = 'verify_mobile',
  verify_transaction = 'verify_transaction',
  newsletter_subscription = 'newsletter_subscription',
  verify_account_deletion = 'verify_account_deletion'
}
@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 6, nullable: true })
  otp: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  mobile: string;

  @Column({ enum: OtpTypes })
  type: OtpTypes;

  @Column({ type: 'datetime', nullable: true })
  expires: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'bit', default: 0 })
  blacklisted: boolean;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'datetime', nullable: true })
  verifiedAt: Date;

  @Column({ type: 'varchar', length: 40, nullable: true })
  entityId: string;
}