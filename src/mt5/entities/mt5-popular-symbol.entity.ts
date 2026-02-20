/**
 * Popular Symbol Entity
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 *
 * Import Update:
 * - Symbol: ./symbol.entity → ./mt5-symbol.entity
 */

import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Mt5Symbol } from './mt5-symbol.entity';

@Entity('popular_symbol')
@Unique(['symbolId'])
export class PopularSymbol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbolId: number;

  @Column({
    type: 'datetime2',
    default: () => 'GETDATE()',
  })
  popularSince: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Mt5Symbol, (symbol) => symbol.popularSymbols, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'symbolId' })
  symbol: Mt5Symbol;

  @Column({
    type: 'datetime2',
    default: () => 'GETDATE()',
  })
  lastActiveAt: Date;
}
