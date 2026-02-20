import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TicketCategoryDesk } from './ticket-category-desk.entity';
import { EmailList } from 'src/mail/entities/emailList.entity';

@Entity()
export class TicketCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    categories: string;

    @OneToMany(() => TicketCategoryDesk, (categoryDesk) => categoryDesk.ticketCategory, { cascade: true })
    categoryDesks: TicketCategoryDesk[];

    @OneToMany(() => EmailList, (emailList) => emailList.ticketCategory)
    emailList: EmailList[]
}
