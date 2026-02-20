import { ListColumnsMeta } from 'src/list-columns-meta/entities/list-columns-meta.entity';
import { ListViewsFilter } from 'src/list-views-filter/entities/list-views-filter.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
} from 'typeorm';
@Entity()
export class ListColumnsSort {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sortOrder: string;

  @Index()
  @ManyToOne(() => ListViewsFilter)
  listViewFilter: ListViewsFilter;

  @Index()
  @ManyToOne(() => ListColumnsMeta)
  listColumnMeta: ListColumnsMeta;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
