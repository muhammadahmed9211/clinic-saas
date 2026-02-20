import { Partner } from 'src/settings/entities/partner.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum LinkType {
  CLIENT = 'Client',
  SUB_IB = 'Sub IB'
}

@Entity()
export class partner_links {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  partnerId: number;

  @CreateDateColumn({ nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  creationTime: Date;

  @UpdateDateColumn({ nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  lastUpdateTime: Date;

  @Column({ nullable: true, type: 'text' })
  name: string;

  @Column({ nullable: true, type: 'text' })
  languageIso: string;

  @Column({ nullable: true, type: 'text' })
  secondaryUrl: string;

  @Column({ nullable: true, type: 'text' })
  url: string;

  @Column({ nullable: true, type: 'text' })
  p1: string;

  @Column({ nullable: true, type: 'text' })
  p2: string;

  @Column({ nullable: true, type: 'text' })
  p3: string;

  @Column({ nullable: true, type: 'text' })
  p4: string;

  @Column({ nullable: true, type: 'text' })
  p5: string;

  @Column({ nullable: true, type: 'text' })
  p6: string;

  @Column({ nullable: true, type: 'text' })
  urlWithParams: string;

  @Column({ nullable: true, type: 'text' })
  urlForPreview: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  appId: number;

  @Column({ nullable: true })
  published: boolean;

  @Column({ nullable: true, type: 'text' })
  appDisplayName: string;

  @Column({ type: 'nvarchar', nullable: true, length: 'max' })
  brokerIds: string;

  @Column({ nullable: true })
  isRegulated: boolean;

  @Column({ nullable: true })
  isAmpersandForbidden: boolean;

  @Column({ nullable: true })
  replaceInsteadOfAdd: boolean;

  @Column({ nullable: true, type: 'text' })
  detailsImageUrl: string;

  @Column({ nullable: true, type: 'text' })
  downloadAssets: string;

  @Column({ nullable: true, type: 'text' })
  lineViewImageUrl: string;

  @Column({ nullable: true })
  badge: string;

  @Column({ nullable: true })
  sort: number;

  @Column({ nullable: true, type: 'text' })
  category: string;

  @Column({ nullable: true, type: 'text' })
  subCategory: string;

  @Column({ nullable: true, type: 'text' })
  assetsUrl: string;

  @Column({ nullable: true })
  commission: number;

  @Column({ nullable: true, type: 'text' })
  commissionCurrency: string;

  @Column({ nullable: true, type: 'text' })
  commissionType: string;

  @Column({ nullable: true, type: 'text' })
  customVisitId: string;

  @Column({ nullable: true, type: 'text' })
  redirectUrl: string;

  @Column({ nullable: true })
  systemId: number;

  @Column({ nullable: true, type: 'text' })
  commissionTerms: string;

  @Column({ nullable: true, type: 'text' })
  order: string;

  @Column({ nullable: true, type: 'text' })
  restrictions: string;

  @Column({ nullable: true, type: 'text' })
  promoMethods: string;

  @Column({ nullable: true, type: 'text' })
  appBlockedCountries: string;

  @Column({ nullable: true, type: 'text' })
  requirements: string;

  @Column({ nullable: true, type: 'text' })
  ipWhitelist: string;

  @Column({ nullable: true, type: 'text' })
  allowedOrigins: string;

  @Column({ nullable: true, type: 'text' })
  redirectAfterPixel: string;

  @Column({ nullable: true })
  bypassIpWhitelist: boolean;

  @Column({ nullable: true })
  checkOrigin: boolean;

  @Column({ nullable: true })
  isInUrlForbidden: boolean;

  @Column({ nullable: true })
  kill: boolean;

  @Column({ nullable: true, type: 'text' })
  allowedReferrer: string;

  @Column({ nullable: true })
  checkReferrer: boolean;

  @Column({ nullable: true })
  isKilled: boolean;

  @Column({ nullable: true, type: 'text' })
  imageUrl: string;

  @ManyToOne(() => Partner, (partner) => partner.partner_links)
  @JoinColumn({ name: 'partnerId' })
  partner: Partner;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true, type: 'text' })
  utmSource: string;

  @Column({ nullable: true, type: 'text' })
  source: string;

  @Column({ nullable: true, type: 'text' })
  classification: string;
  
  @Column({ nullable: true })
  commissionProfileId:number;

  @Column({nullable:true})
  partnerTypeId:number
  
  @Column({ type: 'text', default: LinkType.CLIENT })
  linkType: string;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Column({ nullable: true, type: 'text' })
  utmMedium: string;

  @Column({ nullable: true, type: 'text' })
  utmCampaign: string;

  @Column({ nullable: true, type: 'text' })
  campaignId: string;

  @Column({ nullable: true, type: 'text' })
  utmContent: string;

  @Column({ nullable: true, type: 'text' })
  utmTerm: string;
}
