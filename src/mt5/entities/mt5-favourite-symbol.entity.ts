import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Mt5Symbol } from 'src/mt5/entities/mt5-symbol.entity';

@Entity('favourite_symbol')
@Unique(['userId', 'symbolId']) // composite key uniqueness
export class FavouriteSymbol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  symbolId: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.favouriteSymbols, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Mt5Symbol, (symbol) => symbol.favouriteSymbols, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'symbolId' })
  symbol: symbol;
}
