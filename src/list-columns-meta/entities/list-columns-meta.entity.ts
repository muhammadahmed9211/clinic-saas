import { ListColumnsGroup } from 'src/list-columns-group/entities/list-columns-group.entity';
import { ListName } from 'src/list-item/entities/list-name.entity';
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
export class ListColumnsMeta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  label: string;

  @Column({ nullable: true })
  type: string;

  @Column({ default: false })
  isFilterAble: boolean;

  @Column({ default: false })
  isSortable: boolean;

  @Column({ default: true })
  isVisible: boolean;

  @Index()
  @ManyToOne(() => ListName)
  @JoinColumn({ name: 'listId' })
  list: ListName;

  @Column()
  listId: number;

  @Index()
  @ManyToOne(() => ListColumnsGroup)
  group: ListColumnsGroup;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
