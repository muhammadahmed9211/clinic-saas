import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AutomationConfig } from './automation-config.entity';

@Entity()
export class AutomationExecutionLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  automationConfigId: number;

  @ManyToOne(() => AutomationConfig, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'automationConfigId' })
  automationConfig: AutomationConfig;

  @Column()
  entityId: number;

  @Column()
  entityType: string;

  @Column({ type: 'varchar' })
  previousStatus: string;

  @Column({ type: 'varchar', nullable: true })
  newStatus: string;

  @Column({ type: 'varchar' })
  systemStatus: string;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  executionDetailsJson: string | null; // Store JSON as string for MSSQL compatibility

  @Column({ default: true })
  wasSuccessful: boolean;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  executedAt: Date;

  // Getter for executionDetails
  get executionDetails(): Record<string, any> | null {
    if (!this.executionDetailsJson) return null;
    try {
      return JSON.parse(this.executionDetailsJson);
    } catch (e) {
      console.error('Error parsing executionDetails JSON:', e);
      return null;
    }
  }

  // Setter for executionDetails
  set executionDetails(value: Record<string, any> | null) {
    this.executionDetailsJson = value === null ? null : JSON.stringify(value);
  }
}
