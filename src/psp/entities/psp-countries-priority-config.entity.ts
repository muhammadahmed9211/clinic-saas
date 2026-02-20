import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Countries } from './countries.entity';
import { User } from 'src/users/entities/user.entity';
import { PspCountriesPriority } from './psp-countries-priority.entity';

@Entity()
export class PspCountriesPriorityConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  countryId: number;

  @ManyToOne(() => Countries)
  @JoinColumn({ name: 'countryId' })
  country: Countries;

  @Column()
  userId: number;

  @Column()
  priority: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => PspCountriesPriority, (p) => p.config)
  psp: PspCountriesPriority[];

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
