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
  JoinColumn,
} from 'typeorm';
@Entity()
export class ListViewColumn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sequence: number;

  @Column()
  isSticky: boolean;

  @Index()
  @ManyToOne(() => ListColumnsMeta)
  @JoinColumn({ name: 'listColumnsMetaId' })
  listColumnsMeta: ListColumnsMeta;

  @Column()
  listColumnsMetaId:number

  @Index()
  @ManyToOne(() => ListViewsFilter)
  listViewFilter: ListViewsFilter;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
