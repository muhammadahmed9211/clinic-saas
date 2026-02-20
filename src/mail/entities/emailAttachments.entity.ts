import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { InboxEmail } from './inboxEmails.entity';
  
  @Entity()
  export class EmailAttachments {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  path: string;
  
  @Column({ nullable: true })
  fileSize: string;
  
  @Column({ nullable: true })
  fileType: string;
  
  @Column({ nullable: true })
  fileName: string;

  @Column({ default: false })
  isInline: boolean;

  @Column({ nullable: true })
  contentId: string;
  
  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
  
  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
  
  @DeleteDateColumn({ type: 'datetime' })
  deleted_at: Date;

  @Column({ nullable: true })
  messageId: string;
  }
  