import { EntityHelper } from 'src/utils/entity-helper';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { EmailMapping } from './email-mapping.entity';

@Entity()
@Unique(['name','deletedAt'])
export class EmailEvent extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 'MAX'})
  name: string;

  @Column({  type: 'nvarchar', length: 'MAX',nullable: true })
  description: string;

  @OneToMany(
    () => EmailMapping,
    (emailMapping) => emailMapping.emailEvent,
  )
  emailMapping: EmailMapping[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  createdBy: User;
}
