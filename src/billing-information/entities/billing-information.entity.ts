import { Countries } from 'src/psp/entities/countries.entity';
import { User } from 'src/users/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class BillingInformation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'nvarchar',
    length: 100,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
    nullable: true,
  })
  name: string;

  @Column({
    type: 'nvarchar',
    length: 100,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
    nullable: true,
  })
  country: string;

  @Column()
  countryId: number;

  @ManyToOne(()=>Countries)
  @JoinColumn({name:"countryId"})
  countryInfo: Countries;

  @Column({
    type: 'nvarchar',
    length: 100,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
    nullable: true,
  })
  city: string;

  @Column({
    type: 'nvarchar',
    length: 100,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
    nullable: true,
  })
  address: string;

  @Column({
    type: 'nvarchar',
    length: 100,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'nvarchar',
    length: 100,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
    nullable: true,
  })
  postalCode: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
