import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class zapier_webhook_logs {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'Unique identifier for the participant', example: '234' })
    id?: number;

    @Column({ type: 'nvarchar', length: 'max' })
    payload: string;

    @Column({ nullable: true })
    @ApiProperty({ description: 'Email of the participant', example: 'john.doe@example.com' })
    @IsOptional()
    email?: string;
    
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;
}
