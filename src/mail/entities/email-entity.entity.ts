import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
  } from 'typeorm';
import { Template } from './template.entity';
import { EmailVariable } from './email-variable.entity';
  
  @Entity()
  export class EmailEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
  
    @DeleteDateColumn({ type: 'datetime', default: null })
    deleted_at: Date;

    @OneToMany(() => EmailVariable, (variable) => variable.emailEntity, { nullable: true, cascade: true })
    variables: EmailVariable[];

    @OneToMany(() => Template, (template) => template.entity)
    templates: Template[];
  }
  