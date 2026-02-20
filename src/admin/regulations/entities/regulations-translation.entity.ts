import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Regulations } from './regulations.entity'; 
@Entity()
export class RegulationTranslations {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Regulations, (regulation) => regulation.translations, {
        onDelete: 'CASCADE', 
    })
    regulation: Regulations;

    @Column({ nullable: true })
    fieldName: string; 

    @Column({ nullable: true })
    languageCode: string; 

    @Column({ nullable: true })
    translationText: string; 
}
