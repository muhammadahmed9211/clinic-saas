import { Entity, PrimaryGeneratedColumn, Column, Check } from 'typeorm';
import { OtpTypes } from './otp.entity';

@Entity()
@Check(
  `"verificationType" IN ('email', 'mobile', 'password', 'affiid', 'email_mobile')`,
)
export class UserVerification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  mobile: string;

  @Column({ type: 'varchar', nullable: false })
  sid: string;

  @Column({ type: 'varchar', nullable: false })
  verificationType: string;

  @Column({ type: 'varchar', nullable: true })
  deviceId: string;

  @Column({ enum: OtpTypes })
  reason: OtpTypes;

  @Column({ type: 'bit', default: false })
  isMobileVerified: boolean;

  @Column({ type: 'bit', default: false })
  isEmailVerified: boolean;

  @Column({ type: 'bit', default: false })
  isAffiIDVerified: boolean;

  @Column({ type: 'bit', default: true })
  isActive: boolean;

  @Column({ type: 'int', nullable: false })
  createdAt: number;

  @Column({ type: 'int', nullable: true })
  updatedAt: number;
}
