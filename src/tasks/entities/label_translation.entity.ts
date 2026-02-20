import { EntityHelper } from 'src/utils/entity-helper';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Label } from './label.entity';
import { Regulations } from 'src/admin/regulations/entities/regulations.entity';

@Entity()
@Unique(['langCode','regulation','label','deletedAt'])
export class LabelTranslation extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Label, { eager: true })
  label: Label;

  @Column()
  langCode: string;

  @Column()
  text: string;

  @ManyToOne(() => Regulations, { nullable: true })
  regulation: Regulations;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
