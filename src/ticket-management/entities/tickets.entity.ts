import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { CreatedFor, TicketPriority, TicketStatus } from '../dto/tickets.dto';
import { TicketReplies } from './ticket-replies.entity';
import { User } from 'src/users/entities/user.entity';
import { TicketCategory } from './ticket-category.entity';
import { Desk } from 'src/admin/custom-dropdown/custom-dropdown/entities/desk.entity';
import { notes } from 'src/admin/kyc/entities/kycNotes.entity';
import { TicketCollaborators } from './ticket-collaborators.entity';

@Entity()
export class Tickets {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'nvarchar', length: 255 })
  title: string;

  @Column({ nullable: true, type: 'nvarchar', length: 255 })
  subject: string;

  @Column({ nullable: true, type: 'nvarchar', length: 'max' })
  description: string;

  @Column({ nullable: true })
  category_id: number;

  @ManyToOne(() => TicketCategory, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: TicketCategory;

  @Column({
    nullable: true,
    type: 'nvarchar',
    length: 255,
    enum: TicketPriority,
    default: TicketPriority.LOW,
  })
  priority: TicketPriority;

  @Column({
    type: 'nvarchar',
    length: 255,
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status: TicketStatus;

  @Column({ nullable: true, type: 'int' })
  ticketNumber: number;

  @Column({ nullable: true, type: 'int', })
  userId: number;

  @Column({
    nullable: true,
    type: 'nvarchar',
    transformer: {
      to: (value: string[]) => {
        if (!value) return null;
        return Array.isArray(value) ? JSON.stringify(value) : value;
      },
      from: (value: string) => {
        if (!value || value === 'null' || value === '') return [];
        
        // If it's already an array, return it
        if (Array.isArray(value)) return value;
        
        // If it's a string, try to parse as JSON
        if (typeof value === 'string') {
          const trimmed = value.trim();
          // Check if it looks like a JSON array
          if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
              return JSON.parse(value);
            } catch (error) {
              // If parsing fails, wrap the string in an array
              return [value];
            }
          } else {
            // If it's a plain string (like email), wrap it in an array
            return [value];
          }
        }
        
        return [];
      },
    }
  })
  attachments: string[];

  @OneToMany(() => TicketReplies, (reply) => reply.ticket, { cascade: true })
  replies: TicketReplies[];

  @Column({ nullable: true, type: 'nvarchar', length: 'max' })
  comments: string;

  // @ManyToOne(() => User, { nullable: true })
  // collaborator: User;

  // @Column({ nullable: true })
  // collaboratorId: number;

  @OneToMany(() => TicketCollaborators, (collaborator) => collaborator.ticket, {
    cascade: true,
  })
  ticketCollaborators: TicketCollaborators[];

  @ManyToOne(() => User, { nullable: true })
  assignee: User | null;

  @Column({ nullable: true })
  assigneeId: number | null;

  @ManyToOne(() => User, { nullable: true })
  createdBy: User;

  @Column({ nullable: true })
  createdById: number;

  // @ManyToOne(() => User, { nullable: true })
  // requestedBy: User; //user can be operator partner or client 

  // @Column({ nullable: true, type: 'nvarchar', length: 255 })
  // requesterType: string;

  @Column({
    nullable: true,
    type: 'nvarchar',
    length: 255,
    enum: CreatedFor,
    default: CreatedFor.OPERATOR,
  })
  createdFor: CreatedFor;

  @ManyToOne(() => User, { nullable: true })
  createdForId: User;

  @Column({ nullable: true })
  createdForIdId: number;

  @Column()
  deskId: number | null;

  @ManyToOne(() => Desk,{ nullable: true })
  @JoinColumn({ name: 'deskId' })
  desk: Desk | null;

  @Column({ nullable: true, type: 'nvarchar', length: 255 })
  ticketType: string; //creator type

  @CreateDateColumn({ nullable: true, type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true, type: 'datetime' })
  updatedAt: Date;

  @Column({ nullable: true, type: 'datetime' })
  resolvedAt: Date;

  @Column({ nullable: true, type: 'datetime' })
  closedAt: Date;

  @Column({ nullable: true, type: 'nvarchar', length: 255 })
  closedReason: string;

  @DeleteDateColumn({ nullable: true, type: 'datetime' })
  deleteAt: Date;

  @OneToMany(() => notes, (ticketNote) => ticketNote.ticket)
  ticketNotes: notes;

  @Column({ nullable: true, type: 'nvarchar', length: 255 })
  crmLink: string;

  @Column({ nullable: true, type: 'nvarchar', length: 255 })
  clientLink: string;

  @Column({default:'portal'})
  platform: string;
  
  @Column({ nullable: true, type: 'bit', default: false })
  permanentlyClosed: boolean;

  @Column({ nullable: true, type: 'datetime' })
  permanentlyClosedAt: Date;

  @Column({ nullable: true, type: 'nvarchar', length: 255 })
  permanentlyClosedReason: string;
  
  @Column({nullable:true})
  messageId: string;

  @Column({nullable:true})
  fromEmail: string;

  @Column({nullable: true, type:'nvarchar',transformer: {
      to: (value: string[]) => {
        if (!value) return null;
        return Array.isArray(value) ? JSON.stringify(value) : value;
      },
      from: (value: string) => {
        if (!value || value === 'null' || value === '') return [];
        
        // If it's already an array, return it
        if (Array.isArray(value)) return value;
        
        // If it's a string, try to parse as JSON
        if (typeof value === 'string') {
          const trimmed = value.trim();
          // Check if it looks like a JSON array
          if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
              return JSON.parse(value);
            } catch (error) {
              // If parsing fails, wrap the string in an array
              return [value];
            }
          } else {
            // If it's a plain string (like email), wrap it in an array
            return [value];
          }
        }
        
        return [];
      },
    }
  })
  to: string[];

  @Column({nullable: true, type:'nvarchar',transformer: {
      to: (value: string[]) => {
        if (!value) return null;
        return Array.isArray(value) ? JSON.stringify(value) : value;
      },
      from: (value: string) => {
        if (!value || value === 'null' || value === '') return [];
        
        // If it's already an array, return it
        if (Array.isArray(value)) return value;
        
        // If it's a string, try to parse as JSON
        if (typeof value === 'string') {
          const trimmed = value.trim();
          // Check if it looks like a JSON array
          if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
              return JSON.parse(value);
            } catch (error) {
              // If parsing fails, wrap the string in an array
              return [value];
            }
          } else {
            // If it's a plain string (like email), wrap it in an array
            return [value];
          }
        }
        
        return [];
      },
    }
  })
  cc: string[];

  @Column({nullable: true, type:'nvarchar',transformer: {
      to: (value: string[]) => {
        if (!value) return null;
        return Array.isArray(value) ? JSON.stringify(value) : value;
      },
      from: (value: string) => {
        if (!value || value === 'null' || value === '') return [];
        
        // If it's already an array, return it
        if (Array.isArray(value)) return value;
        
        // If it's a string, try to parse as JSON
        if (typeof value === 'string') {
          const trimmed = value.trim();
          // Check if it looks like a JSON array
          if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
              return JSON.parse(value);
            } catch (error) {
              // If parsing fails, wrap the string in an array
              return [value];
            }
          } else {
            // If it's a plain string (like email), wrap it in an array
            return [value];
          }
        }
        
        return [];
      },
    }
  })
  bcc: string[];
}
