import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
@Entity('reset_password')
export class ResetPassword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  hash: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ type: 'simple-enum', enum: Status })
  status: Status;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE', nullable: false })
  user: User;

  @Column({ nullable: true })
  expireAt: Date;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
