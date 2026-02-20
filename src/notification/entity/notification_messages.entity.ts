import { Label } from 'src/tasks/entities/label.entity';
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
export class NotificationMessages {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;
}
