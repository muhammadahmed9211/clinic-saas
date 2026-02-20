import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class operator_targets {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => Operator)
  operator: Operator;

  @Column({ type: 'float', nullable: true, default: 0 })
  monthly_deposit: number;

  @Column({ type: 'float', nullable: true, default: 0 })
  daily_lots: number;

  @Column({default: false})
  is_hidden: boolean;

  @Column({ type: 'varchar', nullable: true })
  month: string;

  @Column({ type: 'varchar', nullable: true })
  year: string;

  @BeforeInsert()
  setDefaults() {
    if (!this.month) {
      const currentMonth = new Date().toLocaleString('en-US', {
        month: 'long',
      });
      this.month = currentMonth;
    }

    if (!this.year) {
      const currentYear = new Date().getFullYear().toString();
      this.year = currentYear;
    }
  }

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
