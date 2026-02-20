import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { EmailList } from './emailList.entity';

@Entity()
export class EmailOperations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  jobId: number;

  @Column({ type: 'nvarchar', nullable: true, length: 'max' })
  metaData: string;

  @OneToOne(() => EmailList, { nullable: true })
  @JoinColumn({ name: 'email_id', referencedColumnName: 'id' })
  email: EmailList | null;
}
