import { Client } from 'src/users/entities/client.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserCompliance {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Client, (client) => client.user)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  //json data
  @Column({ type: 'nvarchar', length: 'MAX' })
  userComplianceRecord: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
