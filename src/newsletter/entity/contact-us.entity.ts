import { FileEntity } from "src/files/entities/file.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ContactUs {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    from: string;

    @Column()
    to: string;

    @Column({ type: 'nvarchar', length: 'max' })
    text: string;

    @ManyToOne(() => FileEntity, {
        eager: true,
    })
    file?: FileEntity | null;

    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;
}