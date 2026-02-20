import { ListColumnsMeta } from 'src/list-columns-meta/entities/list-columns-meta.entity';
import { ListName } from 'src/list-item/entities/list-name.entity';
import { EntityHelper } from 'src/utils/entity-helper';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
@Entity()
export class ListColumnsGroup extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Index()
  @ManyToOne(() => ListName)
  list: ListName;

  @OneToMany(() => ListColumnsMeta, (meta) => meta.group)
  meta: ListColumnsMeta;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
