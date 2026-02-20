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
import { partner_kyc_documents } from './partner_kyc_docs.entity';

@Entity()
export class PartnerKYCDocumentDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column({ nullable: true })
  name: string;

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
    () => partner_kyc_documents,
    (partnerKYCDocuments) => partnerKYCDocuments.partnerKYCDocumentDetail,
  )
  @JoinColumn({ name: 'partnerKYCDocumentId', referencedColumnName: 'id' })
  partnerKYCDocuments: partner_kyc_documents;

  @Column({ nullable: true })
  rejectedReasonIds: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
