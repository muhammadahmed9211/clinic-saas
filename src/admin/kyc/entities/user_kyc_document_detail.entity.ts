import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { user_kyc_documents } from 'src/user-kyc-docs/entities/user-kyc-documents.entity';

@Entity()
export class UserKYCDocumentDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  classification: string;

  @Column({ nullable: true })
  idNumber: string;

  @Column({ nullable: true })
  nationality: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'date', nullable: true })
  documentExpiryDate: Date;

  @OneToOne(
    () => user_kyc_documents,
    (userKYCDocuments) => userKYCDocuments.userKYCDocumentDetails,
  )
  @JoinColumn({ name: 'userKYCDocumentId', referencedColumnName: 'id' })
  userKYCDocuments: user_kyc_documents;

  @Column({ nullable: true })
  rejectedReasonIds: string;

  @Column({ nullable: true })
  rejectedReasonOther: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
