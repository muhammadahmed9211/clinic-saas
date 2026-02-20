import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
@Index(['deviceId'], { unique: true })
export class DeviceInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  deviceId: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  deviceType: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  model: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  manufacturer: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  brand: string;

  @Column({ type: 'varchar', length: 20 })
  os: string;

  @Column({ type: 'varchar', length: 100 })
  osVersion: string;

  @Column({ type: 'varchar', length: 50 })
  appVersion: string;

  @Index()
  @Column({ type: 'varchar', length: 200, nullable: true })
  fcmToken: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  locale: string;

  @Column({ type: 'bit', default: false })
  isRegistered: boolean;

  @Index()
  @ManyToOne(() => User, (user) => user.devices, { nullable: true })
  user: User | null;

  @Column({ type: 'text', nullable: true })
  previousUsers: string;

  @Index()
  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  timezone: string;

  @Index()
  @Column({ default: false })
  disableNotifications: boolean;

  @Index()
  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  notificationStep: number;

  @Column({ type: 'datetime', nullable: true })
  lastNotificationSentAt: Date;

  @Index()
  @Column({ type: 'datetime', nullable: true })
  lastAppOpenTime: Date;

  @Index()
  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  firstSeenTime: Date;

  @Index()
  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  deletedAt: Date;
}
