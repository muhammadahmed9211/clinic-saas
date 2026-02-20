import { EntityHelper } from 'src/utils/entity-helper';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Regulations } from 'src/admin/regulations/entities/regulations.entity';
import { EmailEvent } from './email-event.entity';
import { Layout } from 'src/mail/entities/layout.entity';
import { Template } from 'src/mail/entities/template.entity';

@Entity()
@Unique(['langCode','regulation','deletedAt','emailEvent'])
export class EmailMapping extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => EmailEvent)
  emailEvent: EmailEvent;

  @Column()
  langCode: string;

  @ManyToOne(() => Regulations, { nullable: true })
  regulation: Regulations;

  @ManyToOne(() => Layout, { nullable: true })
  headerFooter: Layout;

  @ManyToOne(() => Template, { nullable: true })
  bodyContent: Template;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
