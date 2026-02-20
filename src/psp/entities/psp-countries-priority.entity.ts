import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Countries } from './countries.entity';
import { PSP } from 'src/transaction/entities/psp.entity';
import { User } from 'src/users/entities/user.entity';
import { PspCountriesPriorityConfig } from './psp-countries-priority-config.entity';

@Entity()
export class PspCountriesPriority {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  countryId: number;

  @ManyToOne(() => Countries)
  @JoinColumn({ name: 'countryId' })
  country: Countries;

  @ManyToOne(() => PspCountriesPriorityConfig)
  config: PspCountriesPriorityConfig;

  @Column()
  pspId: number;

  @ManyToOne(() => PSP)
  @JoinColumn({ name: 'pspId' })
  psp: PSP;

  @Column()
  priority: number;
  

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
