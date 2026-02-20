import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class operator_links {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  creationTime: Date;

  @Column({ nullable: true })
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

  @Column({ nullable: true })
  brokerIds: number;

  @Column({ nullable: true })
  isRegulated: boolean;

  @Column({ nullable: true })
  isAmpersandForbidden: boolean;

  @Column({ nullable: true })
  replaceInsteadOfAdd: boolean;

  @Column({ nullable: true, type: 'text' })
  detailsImageUrl: string;

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
  commissionTerms: string;

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

  @Column({ nullable: true, type: 'text' })
  allowedReferrer: string;

  @Column({ nullable: true })
  checkReferrer: boolean;

  @Column({ nullable: true })
  isKilled: boolean;

  @Column({ nullable: true, type: 'text' })
  imageUrl: string;
}
