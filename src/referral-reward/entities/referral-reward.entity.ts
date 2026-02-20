import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
@Unique(['user'])
export class ReferralReward {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  totalEarned: number;

  @Column()
  totalWithdraw: number;

  @Column()
  balance: number;

  @Column({default:0})
  successful: number;

  @Column({default:0})
  registered: number;

  @Column()
  userId: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({name:"userId"})
  user: User;

  @VersionColumn()
  version:number

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
