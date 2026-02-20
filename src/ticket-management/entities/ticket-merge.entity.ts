// merged-ticket.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { Tickets } from './tickets.entity';
  
export enum MergeStatus {
    PRIMARY = 'PRIMARY',
    SECONDARY = 'SECONDARY',
}
  
@Entity('merged_tickets')
export class MergedTicket {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('uuid')
    @Index()
    merge_group_id: string;

    @ManyToOne(() => Tickets)
    @JoinColumn({ name: 'ticket_id' })
    ticket: Tickets;

    @Column()
    ticket_id: number;

    @Column({ type: 'simple-enum', enum: MergeStatus })
    status: MergeStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}