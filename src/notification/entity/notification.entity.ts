import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { Label } from 'src/tasks/entities/label.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class notifications {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user_id: User;

  @ManyToOne(() => Operator, { eager: true, nullable: true })
  @JoinColumn({ name: 'creator_id', referencedColumnName: 'id' })
  creator_id: Operator;

  @Column({ nullable: true })
  entity_id: string;

  @Column()
  entity_name: string;

  @Column({ default: 'Notification' })
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Label, { eager: true, nullable: true })
  @JoinColumn({ name: 'title_label_id', referencedColumnName: 'id' })
  title_label_id: Label;

  @ManyToOne(() => Label, { eager: true, nullable: true })
  @JoinColumn({ name: 'description_label_id', referencedColumnName: 'id' })
  description_label_id: Label;

  @Column({ nullable: true })
  priority: string;

  @Column({ nullable: true })
  link: string;

  @Column()
  created_by: string;

  @Column({ nullable: true })
  admin_description: string;

  @Column({ default: false })
  is_read: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ default: false })
  is_emit: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;
}
