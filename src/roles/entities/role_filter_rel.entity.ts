import { EntityHelper } from 'src/utils/entity-helper';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { RoleFilter } from './role_filter.entity';

@Entity()
export class RoleFilterRel extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  role: Role;

  @ManyToOne(() => RoleFilter, { onDelete: 'CASCADE' })
  roleFilter: RoleFilter;

  @Column({ type: 'text' })
  filterRefIds: string;

  @Column({ type: 'text', nullable: true })
  condition: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
