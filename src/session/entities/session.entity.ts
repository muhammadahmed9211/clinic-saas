import {
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { EntityHelper } from '../../utils/entity-helper';

@Entity()
export class Session extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @Index()
  user: User;

  @Column({ nullable: true })
  fcmToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
