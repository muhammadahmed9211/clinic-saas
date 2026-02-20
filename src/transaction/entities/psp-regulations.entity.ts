import { Regulations } from 'src/admin/regulations/entities/regulations.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { PSP } from './psp.entity';

@Entity()
export class PspRegulations {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PSP, { nullable: false })
  psp: PSP;

  @ManyToOne(() => Regulations, { nullable: false })
  regulation: Regulations;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
