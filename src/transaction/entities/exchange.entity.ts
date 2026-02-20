import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Exchange {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar' })
  name: string;

  @Column({ type: 'nvarchar' })
  contactName: string;

  @Column({ type: 'nvarchar' })
  address: string;

  @Column({ type: 'nvarchar' })
  city: string;

  @Column({ type: 'nvarchar' })
  country: string;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
