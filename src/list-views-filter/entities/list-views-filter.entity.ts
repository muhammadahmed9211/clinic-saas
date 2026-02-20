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
  JoinColumn,
} from 'typeorm';
import { ListName } from 'src/list-item/entities/list-name.entity';
import { User } from 'src/users/entities/user.entity';
import { ListViewColumn } from 'src/list-view-columns/entities/list-view-column.entity';
import { ListColumnFilter } from 'src/list-filter-columns/entities/list-filter-column.entity';
import { ListColumnsSort } from 'src/list-columns-sort/entities/list-columns-sort.entity';
@Entity()
export class ListViewsFilter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  isDefault: boolean;

  @Column()
  isPublic: boolean;

  @Column()
  isUserDefault: boolean;

  @Index()
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Index()
  @ManyToOne(() => ListName)
  list: ListName;

  @OneToMany(() => ListViewColumn, (viewCol) => viewCol.listViewFilter)
  columns: ListViewColumn[];

  @OneToMany(() => ListColumnFilter, (filter) => filter.listViewFilter)
  filters: ListColumnFilter[];

  @OneToMany(() => ListColumnsSort, (sort) => sort.listViewFilter)
  sort: ListColumnsSort[];

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
