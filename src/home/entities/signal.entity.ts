import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';

@Entity('signal')
@Index(['signalId', 'term'], { unique: true })
@Index(['product', 'term'])
@Index(['term', 'createdAt'])
export class Signal extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 50 })
  signalId: string; // The original ID from Trading Central API

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  status: string; // e.g., "new"

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  analysisType: string; // e.g., "TA"

  // Header fields
  @Column({ type: 'nvarchar', length: 20, nullable: true })
  date: string; // e.g., "20251218"

  @Column({ type: 'nvarchar', length: 20, nullable: true })
  hour: string; // e.g., "12:45"

  @Column({ type: 'nvarchar', length: 20, nullable: true })
  timezone: string; // e.g., "CET"

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  author: string; // e.g., "TC"

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  name: string; // e.g., "EUR/CHF"

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  product: string; // e.g., "forex", "crypto", "index", "commodities"

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  term: string; // e.g., "INTRADAY", "ST", "MT"

  @Column({ type: 'nvarchar', length: 10, nullable: true })
  currency: string;

  @Column({ type: 'nvarchar', length: 10, nullable: true })
  country: string;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  sector: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  sectorId: string;

  // Media URLs (stored as JSON)
  @Column({ type: 'nvarchar', length: 500, nullable: true })
  mediaUrl: string; // Main media URL

  @Column({ type: 'nvarchar', length: 2000, nullable: true })
  alternativeMedia: string; // JSON string of alternative media array

  // Code identifiers (stored as JSON)
  @Column({ type: 'nvarchar', length: 500, nullable: true })
  codes: string; // JSON string of code array (ISIN, TICKER, RIC)

  // Option/Watch data (stored as JSON)
  @Column({ type: 'nvarchar', length: 1000, nullable: true })
  watchOptions: string; // JSON string of watch array

  @Column({ type: 'nvarchar', nullable: true })
  expectedMove1Absolute: string;

  @Column({ type: 'nvarchar', nullable: true })
  expectedMove2Absolute: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  expectedMove1Pips: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  expectedMove2Pips: string;

  @Column({ type: 'nvarchar', nullable: true })
  expectedMove1Percent: string;

  @Column({ type: 'nvarchar', nullable: true })
  expectedMove2Percent: string;

  // Chart levels (stored as JSON)
  @Column({ type: 'nvarchar', length: 1000, nullable: true })
  chartLevels: string; // JSON string of chart levels

  // Story fields
  @Column({ type: 'nvarchar', length: 10, nullable: true })
  storyLang: string; // e.g., "EN"

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  keywords: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  title: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

