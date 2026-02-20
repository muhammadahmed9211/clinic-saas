import { FileEntity } from 'src/files/entities/file.entity';
import { User } from 'src/users/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class BankDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'nvarchar',
    length: 255,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
  })
  iban: string;

  @Column({
    type: 'nvarchar',
    length: 255,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
  })
  currency: string;

  @Column({
    type: 'nvarchar',
    length: 255,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
  })
  swift: string;

  @Column({
    type: 'nvarchar',
    length: 255,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
    nullable: true,
  })
  sortCode: string;

  @Column({
    type: 'nvarchar',
    length: 255,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
  })
  name: string;

  @Column({
    type: 'nvarchar',
    length: 255,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
  })
  beneficiaryName: string;

  @Column({
    type: 'nvarchar',
    length: 255,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
  })
  address: string;

  @Column({
    type: 'nvarchar',
    length: 255,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
  })
  state: string;

  @Column({
    type: 'nvarchar',
    length: 255,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
  })
  zipCode: string;

  @Column({
    type: 'nvarchar',
    length: 255,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
  })
  country: string;

  @Column({
    type: 'nvarchar',
    length: 255,
    collation: 'SQL_Latin1_General_CP1_CI_AS',
    nullable: true,
  })
  branchName: string;

  @ManyToOne(() => FileEntity, {
    eager: true,
    nullable: true,
  })
  statement: FileEntity;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
