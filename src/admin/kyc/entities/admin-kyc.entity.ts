import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { LanguageType } from 'src/users/entities/user.entity';

@Entity()
export class required_kyc_documents extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'nvarchar', nullable: true, length: 'max' })
  meta_data: string;

  @Column({ default: false })
  isPartner: boolean;

  @Column({
    type: 'simple-enum',
    enum: LanguageType,
    default: LanguageType.English,
  })
  languageIso: LanguageType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
