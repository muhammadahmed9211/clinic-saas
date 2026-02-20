import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FreshDeskLogs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'bigint' })  
  userId: number;

  @Column({ nullable: true, type: 'nvarchar', length: 255 })
  user_email: string;

  @Column({ nullable: true, type: 'nvarchar', length: 255 })
  actions: string;

  @Column({ nullable: true, type: 'text' })  
  payload_res: string;

}


