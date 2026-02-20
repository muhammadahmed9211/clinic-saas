import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tickets } from './tickets.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class TicketReplies {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'nvarchar', length: 'max' })
  title: string;

  @Column({ nullable: true, type: 'nvarchar', length: 'max' })
  comment: string;

  @Column({ nullable: false })
  ticketId: number;

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

  @Column({nullable: true })
  from: string;

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

  @Column({ nullable: true })
  messageId: string;

  @Column({default:'portal'})
  platform: string;

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

  //ticket
  @Column({ name: 'createdById', type: 'int', nullable: false })
  createdById: number;

  //ticket-replies
  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;


  @ManyToOne(() => Tickets, (ticket) => ticket.replies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticketId', referencedColumnName: 'id' })
  ticket: Tickets;

  @CreateDateColumn({ nullable: true, type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true, type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, type: 'datetime' })
  deleteAt: Date;

}
