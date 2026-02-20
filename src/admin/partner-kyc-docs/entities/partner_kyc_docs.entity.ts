import { CustomStatus } from 'src/admin/client/entities/custom_status.entity';
import { notes } from 'src/admin/kyc/entities/kycNotes.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { PartnerKYCDocumentDetail } from './partner_kyc_document_details.entity';
import { Partner } from 'src/settings/entities/partner.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class partner_kyc_documents {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Partner, (partner) => partner.partnerKycDocuments, {
    eager: true,
  })
  @JoinColumn({ name: 'partnerId' })
  partner: Partner;

  @Column({ nullable: true })
  type: string;

  @Column({ enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  userKycNote: string;

  @Column({ nullable: true })
  documentId: number;

  @Column('uuid', { nullable: true })
  fileId: string;

  @ManyToOne(() => FileEntity, { eager: true })
  @JoinColumn({ name: 'fileId' })
  file: FileEntity;

  @Column({ nullable: true })
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

  @OneToMany(() => notes, (kycNote) => kycNote.partner_id)
  notes: notes[];

  @Column({ nullable: true })
  kycStatus: number;

  @Column({ nullable: true, type: 'text' })
  rejectionReasons: string | null;

  @Column({ nullable: true, type: 'text' })
  rejectionReasonsText: string | null;

  @Column({ nullable: true, type: 'text' })
  translationStatus: string | null;

  @Column({ nullable: true, type: 'text' })
  translationRep: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @Column({ nullable: true, default: false })
  hidden: boolean;

  @ManyToOne(() => CustomStatus)
  @JoinColumn({ name: 'kycStatus' })
  customKycStatus: CustomStatus;

  @OneToOne(
    () => PartnerKYCDocumentDetail,
    (partnerKYCDocumentDetail) => partnerKYCDocumentDetail.partnerKYCDocuments,
  )
  partnerKYCDocumentDetail: PartnerKYCDocumentDetail[];

  @OneToMany(() => notes, (kycNote) => kycNote.partner_kyc_document_id, {
    nullable: true,
  })
  kycNotes: notes[];

  @ManyToOne(() => User, { eager: true, nullable: true })
  approvedBy: User;

  @CreateDateColumn()
  creation_time: Date;

  @UpdateDateColumn()
  modified_time: Date;

  @Column({ nullable: true })
  approval_time: Date;

  @Column({ nullable: true })
  approved_by: number;

  @Column({ nullable: true })
  expiry_time: Date;
}
