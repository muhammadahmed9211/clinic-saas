import { Label } from 'src/tasks/entities/label.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClassificationKeyFeature } from './classification_key_features.entity';
import { ClassificationEligibility } from './classification_eligibility.entity';

@Entity()
export class Classification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Label, { nullable: true })
  title: Label;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => ClassificationKeyFeature, (feature) => feature.classification)
  keyFeatures: ClassificationKeyFeature;

  @OneToMany(() => ClassificationEligibility, (eligibility) => eligibility.classification)
  eligibility: ClassificationEligibility;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;


}
