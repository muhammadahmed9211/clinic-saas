import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  AfterLoad,
  AfterInsert,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { EntityHelper } from '../../utils/entity-helper';
import appConfig from '../../config/app.config';
import { AppConfig } from 'src/config/app-config.type';
import { User } from 'src/users/entities/user.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { user_kyc_documents } from 'src/user-kyc-docs/entities/user-kyc-documents.entity';
import { partner_kyc_documents } from 'src/admin/partner-kyc-docs/entities/partner_kyc_docs.entity';
import { attachments } from 'src/admin/leads/opportunity/entities/attachment.entity';

@Entity({ name: 'file' })
export class FileEntity extends EntityHelper {
  @ApiProperty({ example: 'BFE6423E-F36B-1410-8E91-00FBE52F62A4' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Allow()
  @Column()
  path: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ nullable: true })
  fileSize: string;

  @Column({ nullable: true })
  fileType: string;

  @Column({ nullable: true })
  fileName: string;

  @ManyToOne(() => User, (user) => user.files, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  user: User;

  @ManyToOne(() => User, (operator) => operator.operatorFiles, {
    nullable: true,
  })
  operator: User;

  @OneToMany(() => Operator, (notification) => notification.photo)
  photo: Operator[];

  @OneToMany(
    () => user_kyc_documents,
    (userKycDocuments) => userKycDocuments.file,
  )
  userKycDocuments: user_kyc_documents[];

  @OneToMany(() => attachments, (attachment) => attachment.file)
  attachment: attachments[];

  @OneToMany(
    () => partner_kyc_documents,
    (partnerKycDocuments) => partnerKycDocuments.file,
  )
  partnerKycDocuments: partner_kyc_documents[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @AfterLoad()
  @AfterInsert()
  updatePath() {
    if (this.path.indexOf('/') === 0) {
      this.path = (appConfig() as AppConfig).backendDomain + this.path;
    }
  }
}
