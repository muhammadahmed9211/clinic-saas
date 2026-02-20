import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    Entity,
    Column
  } from 'typeorm';
  import { Regulations } from 'src/admin/regulations/entities/regulations.entity';
  import { TransactionMethod } from './transaction-method.entity';
  
  @Entity()
  export class TransactionMethodRegulations {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => TransactionMethod, { nullable: false })
    method: TransactionMethod;
  
    @ManyToOne(() => Regulations, { nullable: false })
    regulation: Regulations;

    @Column({type:"text" , nullable:true})
    config:string
  
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;
  
    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
  }