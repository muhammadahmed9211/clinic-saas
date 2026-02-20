import { IsOptional } from 'class-validator';
import { CustomStatus } from 'src/admin/client/entities/custom_status.entity';
import { notes } from 'src/admin/kyc/entities/kycNotes.entity';
import { UserKYCDocumentDetail } from 'src/admin/kyc/entities/user_kyc_document_detail.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
  Index,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class user_kyc_documents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Index()
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Index()
  @Column()
  documentId: number;

  @Column('uuid')
  fileId: string;

  @Index()
  @ManyToOne(() => FileEntity, { eager: true })
  @JoinColumn({ name: 'fileId' })
  file: FileEntity;

  @Index()
  @Column()
  field_id: string;

  @Column({
    enum: ['front', 'back'],
    type: 'varchar',
    length: 10,
    default: null,
  })
  side: string;

  @Column({ enum: ['pending', 'rejected', 'approved'], default: 'pending' })
  state: string;

  @Column({ enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @Column({ nullable: true })
  @IsOptional()
  kycNote: string;

  @Column({ nullable: true })
  kycStatus: number;

  @Column({ nullable: true, type: 'text' })
  reasons: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Index()
  @ManyToOne(() => CustomStatus)
  @JoinColumn({ name: 'kycStatus' })
  customKycStatus: CustomStatus;

  @OneToOne(
    () => UserKYCDocumentDetail,
    (userKYCDocumentDetail) => userKYCDocumentDetail.userKYCDocuments,
  )
  userKYCDocumentDetails: UserKYCDocumentDetail[];

  @OneToMany(() => notes, (kycNote) => kycNote.user_kyc_document_id)
  kycNotes: notes[];

  @Index()
  @ManyToOne(() => User, { eager: true, nullable: true })
  approvedBy: User;
}
