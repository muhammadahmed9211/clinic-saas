import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DataUpload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  records: number;

  @Column({ nullable: true })
  uploadedRecords: number;

  @Column({ nullable: true })
  failure: number;

  @Column({ nullable: true })
  operator: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  progress: number;

  @Column({ default: false })
  isCancelled: boolean = false;

  @Column({ type: 'nvarchar', length: 'max', nullable: true })
  errors: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
