import { EmailMapping } from 'src/admin/email-mapping/entity/email-mapping.entity';
import { Regulations } from 'src/admin/regulations/entities/regulations.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToMany,
} from 'typeorm';

@Entity()
@Unique(['name', 'language', 'companyName', 'deletedAt'])
export class Layout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyName: string;

  @Column({ type: 'nvarchar', length: 'MAX' })
  layout: string;

  @Column()
  language: string;

  @Column({ type: 'nvarchar', nullable: true })
  name: string;

  @Column({ type: 'nvarchar', nullable: true })
  regulation: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @OneToMany(() => EmailMapping, (emailMapping) => emailMapping.headerFooter)
  emailMapping: EmailMapping;

  @ManyToOne(() => Regulations, { nullable: true })
  regulationId: Regulations;

  @Column({ type: 'nvarchar', default: 'v1'})
  version: string;
}
