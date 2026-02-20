import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
  } from 'typeorm';
import { EmailEntity } from './email-entity.entity';
  
  @Entity()
  export class EmailVariable {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;

    @Column({default: false})
    is_external: boolean;
  
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
  
    @DeleteDateColumn({ type: 'datetime', default: null })
    deleted_at: Date;

    @ManyToOne(() => EmailEntity, (emailEntity) => emailEntity.variables, { nullable: true, onDelete: 'CASCADE' })
    emailEntity: EmailEntity;
  }