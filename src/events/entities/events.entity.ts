import { EntityHelper } from 'src/utils/entity-helper';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Event extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  serviceName: string;

  @Column({ default: true })
  dataLoggingService: boolean;

  @Column({ default: false })
  emailService: boolean;

  @Column({ default: true })
  eventLoggingService: boolean;

  @Column({ default: false })
  notification: boolean;

  @Column({ default: false })
  task: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
