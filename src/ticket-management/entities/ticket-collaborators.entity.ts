import { CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Tickets } from './tickets.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class TicketCollaborators {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Tickets, (ticket) => ticket.ticketCollaborators, {
    onDelete: 'CASCADE',
  })
  ticket: Tickets;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'collaboratorId' })
  collaborator: User;

}
