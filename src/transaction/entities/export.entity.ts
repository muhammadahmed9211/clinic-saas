import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class ExportedTransactions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  operatorId: number;

  @Column({ nullable: true })
  operatorEmail: string;

  @Column({ type: 'nvarchar', nullable: true, length: 'MAX' })
  url: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
