import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { AutomationConditions } from 'src/utils/interface/automation/automation-conditions.interface';
import { AutomationActions } from 'src/utils/interface/automation/automation-actions.interface';

@Entity()
export class AutomationConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  automationCode: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', default: 'Lead' })
  entityType: string; // 'Lead', 'Client', etc.

  @Column({ type: 'varchar' })
  currentStatus: string; // Current status to match (can be comma-separated list)

  @Column({ type: 'varchar', nullable: true })
  newStatus: string | null; // New status to set (if any)

  @Column({ type: 'varchar', nullable: true })
  systemStatus: string; // System status to set

  @Column({ type: 'varchar', nullable: true })
  nextAction: string; // Next action code

  @Column({ type: 'int' })
  executionFrequencyMinutes: number; // e.g., 15, 60, 1440 (daily)

  @Column({ type: 'time', nullable: true })
  executionTime: string; // Specific execution time (if applicable)

  @Column({ type: 'varchar', nullable: true })
  executionDays: string; // Comma-separated days (e.g., 'Mon,Tue,Wed')

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  conditionsJson: string | null; // JSON object with additional conditions

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  actionsJson: string | null; // JSON object defining actions to perform

  @Column({ type: 'int', default: 0 })
  maxExecutions: number;

  @Column({ type: 'int', default: 0 })
  maxExecutionsDeactivate: number;

  @Column({ type: 'varchar', nullable: true })
  pauseAction: string; // Action code to execute when paused

  @Column({ type: 'int', nullable: true })
  unpauseAfterDays: number | null;

  @Column({ type: 'varchar', nullable: true })
  deactivateAction: string; // Action code to execute when deactivated

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  get conditions(): AutomationConditions | null {
    if (!this.conditionsJson) return null;
    try {
      return JSON.parse(this.conditionsJson);
    } catch (e) {
      console.error('Error parsing conditions JSON:', e);
      return null;
    }
  }

  // Setter for conditions
  set conditions(value: AutomationConditions | null) {
    this.conditionsJson = value === null ? null : JSON.stringify(value);
  }

  // Getter for actions
  get actions(): AutomationActions | null {
    if (!this.actionsJson) return null;
    try {
      return JSON.parse(this.actionsJson);
    } catch (e) {
      console.error('Error parsing actions JSON:', e);
      return null;
    }
  }

  // Setter for actions
  set actions(value: AutomationActions | null) {
    this.actionsJson = value === null ? null : JSON.stringify(value);
  }
}
