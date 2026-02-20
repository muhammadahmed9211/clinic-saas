import { EntityHelper } from 'src/utils/entity-helper';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { LabelTranslation } from './label_translation.entity';
import { UserTask } from './user_task.entity';
import { RejectedReason } from 'src/admin/kyc/entities/rejected_reasons.entity';
import { User } from 'src/users/entities/user.entity';
import { Regulations } from 'src/admin/regulations/entities/regulations.entity';

@Entity()
@Unique(['key','deletedAt'])
export class Label extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 'MAX'})
  key: string;

  @Column({  type: 'nvarchar', length: 'MAX',nullable: true })
  description: string;

  @OneToMany(
    () => LabelTranslation,
    (labelTranslation) => labelTranslation.label,
  )
  labelTranslation: LabelTranslation[];

  @OneToMany(() => UserTask, (userTask) => userTask.label)
  userTask: UserTask[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => RejectedReason, (rejectedReason) => rejectedReason.label)
  rejectedReasons: RejectedReason[];

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @OneToMany(() => Regulations, (regulation) => regulation.regulatedByLabel)
  regulations: Regulations[];

  @OneToMany(() => Regulations, (regulation) => regulation.licenseLabel)
  licenses: Regulations[];
}
