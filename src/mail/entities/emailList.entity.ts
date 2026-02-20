import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { EmailOperations } from './emailOperations.entity';
import { InboxEmail } from './inboxEmails.entity';
import { TicketCategory } from 'src/ticket-management/entities/ticket-category.entity';

@Entity()
export class EmailList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  email: string;

  @Column({ default: false })
  ticketConfigured: boolean;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'datetime', default: null })
  deleted_at: Date;

  @OneToOne(() => EmailOperations, (emailList) => emailList.email)
  emails: EmailOperations;

  @OneToMany(() => InboxEmail, (inboxEmail) => inboxEmail.email)
  inboxEmail: InboxEmail;

  @ManyToOne(()=> TicketCategory, (ticketCategory) => ticketCategory.emailList, { nullable: true })
  ticketCategory: TicketCategory
}
