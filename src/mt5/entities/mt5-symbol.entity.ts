import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Check,
} from 'typeorm';
import { OneToMany } from 'typeorm';
import { FavouriteSymbol } from './mt5-favourite-symbol.entity';
import { PopularSymbol } from './mt5-popular-symbol.entity';

@Entity('symbol')
export class Mt5Symbol {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true, unique: true })
  symbolCode: string;

  @Column({ nullable: true })
  symbolPath: string;

  @Column({ nullable: true })
  symbolDescription: string;

  @Column({ nullable: true })
  symbolSpread: number;

  @Column({ nullable: true })
  symbolChange: number;

  @Column({
    type: 'nvarchar',
    length: 'MAX',
    nullable: true,
    transformer: {
      to(value: object | null): string | null {
        return value ? JSON.stringify(value) : null;
      },
      from(value: string | null): object | null {
        return value ? JSON.parse(value) : null;
      },
    },
  })
  @Check(`ISJSON(symbolData) = 1`)
  symbolData: object;

  @Column({ nullable: true })
  stepVolume: number;

  @Column({ nullable: true })
  minVolume: number;

  @Column({ nullable: true })
  maxVolume: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => FavouriteSymbol, (favouriteSymbol) => favouriteSymbol.symbol)
  favouriteSymbols: FavouriteSymbol[];

  @Column({ nullable: true, name: 'openingPrice' })
  opening: string;
  // Additional columns migrated from mt5-rest-api by Arshad Shaheen - Oct 23, 2025
  @Column({ nullable: true })
  contractSize: number;

  @Column({ default: false })
  isTopMover: boolean;

  @OneToMany(() => PopularSymbol, (popularSymbol) => popularSymbol.symbol)
  popularSymbols: PopularSymbol[];

  @Column({ nullable: true })
  multiply: number;

  @Column({ type: 'timestamp', nullable: true })
  openingPriceUpdatedAt?: Date;
}
