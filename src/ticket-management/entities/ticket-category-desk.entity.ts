import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TicketCategory } from './ticket-category.entity';
import { Desk } from 'src/admin/custom-dropdown/custom-dropdown/entities/desk.entity';

@Entity()
export class TicketCategoryDesk {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ticket_category_id: number;

  @Column()
  deskId: number;

  @Column({ default: false })
  isDefaultDesk: boolean;

  @ManyToOne(() => TicketCategory, (ticketCategory) => ticketCategory.categoryDesks)
  @JoinColumn({ name: 'ticket_category_id' })
  ticketCategory: TicketCategory;

  @ManyToOne(() => Desk)
  @JoinColumn({ name: 'deskId' })
  desk: Desk;
}
