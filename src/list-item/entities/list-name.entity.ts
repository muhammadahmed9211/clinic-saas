import { ListColumnsGroup } from 'src/list-columns-group/entities/list-columns-group.entity';
import { ListViewsFilter } from 'src/list-views-filter/entities/list-views-filter.entity';
import { EntityHelper } from 'src/utils/entity-helper';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
} from 'typeorm';
@Entity()
export class ListName extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  name: string;

  @Column()
  appName: string;

  @OneToMany(() => ListColumnsGroup, (group) => group.list)
  groups: ListColumnsGroup;

  @OneToMany(() => ListViewsFilter, (view) => view.list)
  views: ListViewsFilter[];

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
