import { Label } from 'src/tasks/entities/label.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class RejectedReason {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => Label)
  @JoinColumn({ name: 'labelId' })
  label: Label;
}
