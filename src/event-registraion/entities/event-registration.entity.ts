import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class EventRegistration {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, type: 'nvarchar' })
    firstName: string;

    @Column({ nullable: true, type: 'nvarchar' })
    lastName: string;

    @Column({ nullable: true, type: 'varchar' })
    email: string;

    @Column({ nullable: true, type: 'nvarchar' })
    country: string;

    @Column({ nullable: true, type: 'nvarchar' })
    countryIso: string;

    @Column({ nullable: true, type: 'nvarchar' })
    phoneNumber: string;

    @Column({ nullable: true, type: 'nvarchar' })
    telephone: string;

    @Column({ nullable: true, type: 'nvarchar' })
    telephonePrefix: string;

    @Column({ nullable: true, type: 'nvarchar' })
    eventType: string;

    @Column({ nullable: true, type: 'nvarchar' })
    eventName: string;

    @Column({ nullable: true })
    eventStartDate: Date;

    @Column({ nullable: true })
    eventEndDate: Date;

    @Column({ nullable: true, type: 'nvarchar' })
    eventStartTime: string;

    @Column({ nullable: true, type: 'nvarchar' })
    eventEndTime: string;

    @Column({ nullable: true, type: 'nvarchar' })
    source: string;

    @Column({ nullable: true, type: 'nvarchar' })
    utmSource: string;

    @Column({ nullable: true, type: 'nvarchar' })
    utmCampaign: string;

    @Column({ nullable: true, type: 'nvarchar' })
    utmContent: string;

    @Column({ nullable: true, type: 'nvarchar' })
    utmMedium: string;

    @Column({ nullable: true, type: 'nvarchar' })
    utmTerm: string;

    @Column({ nullable: true, type: 'nvarchar' })
    campaignId: string;

    @Column({ nullable: true, type: 'nvarchar' })
    languageIso: string;

    @Column({ nullable: true, type: 'nvarchar', length: 'MAX' })
    question: string;

    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;

    @Column({ default: true })
    isActive: boolean;
}