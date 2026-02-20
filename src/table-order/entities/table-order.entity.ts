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
export class TableColumnOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order: number;

  @Column({ type: 'nvarchar' })
  columnName: string;

  @Column({ type: 'nvarchar' })
  tableName: string;

  @Column({ default: false })
  isSticky: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  user: User;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
