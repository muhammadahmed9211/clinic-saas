import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AccountClassification } from 'src/users/entities/client.entity';

export class GeneratePartnerLinkDto {
  @ApiProperty({ example: '1002' })
  @IsNotEmpty()
  partnerId: number;

  @ApiProperty({ example: 'p1value' })
  @IsString()
  @IsOptional()
  p1?: string;

  @ApiProperty({ example: 'p2value' })
  @IsString()
  @IsOptional()
  p2?: string;

  @ApiProperty({ example: 'p3value' })
  @IsString()
  @IsOptional()
  p3?: string;

  @ApiProperty({ example: 'p4value' })
  @IsString()
  @IsOptional()
  p4?: string;

  @ApiProperty({ example: 'p5value' })
  @IsString()
  @IsOptional()
  p5?: string;

  @ApiProperty({ example: 'p6value' })
  @IsString()
  @IsOptional()
  p6?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  popUnder?: boolean;

  @ApiProperty({ example: 'link', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'link desc', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'IB' })
  @IsString()
  @IsOptional()
  utmSource?: string;

  @ApiProperty()
  @IsOptional()
  utmMedium?: string;

  @ApiProperty()
  @IsOptional()
  utmCampaign?: string;

  @ApiProperty()
  @IsOptional()
  campaignId?: string;

  @ApiProperty()
  @IsOptional()
  utmContent?: string;

  @ApiProperty()
  @IsOptional()
  utmTerm?: string;

  @ApiProperty({ example: 'IBRegistrationLink' })
  @IsString()
  @IsOptional()
  source?: string;

  @ApiProperty({ example:1 })
  @IsOptional()
  @IsNumber()
  commissionProfileId?:number
}

export class UpdateGeneratedLinkDto {
  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  partnerId?: number;
 
  @ApiProperty({ example: 'p1value' })
  @IsString()
  @IsOptional()
  p1?: string;

  @ApiProperty({ example: 'p2value' })
  @IsString()
  @IsOptional()
  p2?: string;

  @ApiProperty({ example: 'p3value' })
  @IsString()
  @IsOptional()
  p3?: string;

  @ApiProperty({ example: 'p4value' })
  @IsString()
  @IsOptional()
  p4?: string;

  @ApiProperty({ example: 'p5value' })
  @IsString()
  @IsOptional()
  p5?: string;

  @ApiProperty({ example: 'p6value' })
  @IsString()
  @IsOptional()
  p6?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  popUnder?: boolean;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  systemId?: number;

  @ApiProperty({ example: 'p6value' })
  @IsString()
  @IsOptional()
  order?: string;

  @ApiProperty({ example: 'www.exampleurl.com' })
  @IsOptional()
  @IsString()
  detailImageUrl?: string;

  @ApiProperty({ example: 'www.exampleurl.com' })
  @IsOptional()
  @IsString()
  redirectUrl?: string;

  @ApiProperty({ example: 'example' })
  @IsOptional()
  @IsString()
  downloadAssets?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isInUrlForbidden?: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  kill?: boolean;

  @ApiProperty({ example: new Date() })
  @IsOptional()
  @IsString()
  creationTime?: Date;

  @ApiProperty({ example: new Date() })
  @IsOptional()
  @IsString()
  lastUpdateTime?: Date;

  @ApiProperty({ example: 'link name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'en' })
  @IsOptional()
  @IsString()
  languageIso?: string;

  @ApiProperty({ example: 'http://secondaryurl.com' })
  @IsOptional()
  @IsString()
  secondaryUrl?: string;

  @ApiProperty({ example: 'http://urlwithparams.com' })
  @IsOptional()
  @IsString()
  urlWithParams?: string;

  @ApiProperty({ example: 'http://urlforpreview.com' })
  @IsOptional()
  @IsString()
  urlForPreview?: string;

  @ApiProperty({ example: 'link description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  appId?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiProperty({ example: 'App Display Name' })
  @IsOptional()
  @IsString()
  appDisplayName?: string;

  @ApiProperty({ example: [1, 12, 312] })
  @IsArray()
  @Type(() => Number)
  @IsOptional()
  brokerIds?: number[];

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isRegulated?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isAmpersandForbidden?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  replaceInsteadOfAdd?: boolean;

  @ApiProperty({ example: 'http://detailsimageurl.com' })
  @IsOptional()
  @IsString()
  detailsImageUrl?: string;

  @ApiProperty({ example: 'http://lineviewimageurl.com' })
  @IsOptional()
  @IsString()
  lineViewImageUrl?: string;

  @ApiProperty({ example: 'badge' })
  @IsOptional()
  @IsString()
  badge?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiProperty({ example: 'category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 'subcategory' })
  @IsOptional()
  @IsString()
  subCategory?: string;

  @ApiProperty({ example: 'http://assetsurl.com' })
  @IsOptional()
  @IsString()
  assetsUrl?: string;

  @ApiProperty({ example: 10 })
  @IsOptional()
  @IsNumber()
  commission?: number;

  @ApiProperty({ example: 'USD' })
  @IsOptional()
  @IsString()
  commissionCurrency?: string;

  @ApiProperty({ example: 'CPC' })
  @IsOptional()
  @IsString()
  commissionType?: string;

  @ApiProperty({ example: 'customVisitId' })
  @IsOptional()
  @IsString()
  customVisitId?: string;

  @ApiProperty({ example: 'commission terms' })
  @IsOptional()
  @IsString()
  commissionTerms?: string;

  @ApiProperty({ example: 'restrictions' })
  @IsOptional()
  @IsString()
  restrictions?: string;

  @ApiProperty({ example: 'promo methods' })
  @IsOptional()
  @IsString()
  promoMethods?: string;

  @ApiProperty({ example: 'blocked countries' })
  @IsOptional()
  @IsString()
  appBlockedCountries?: string;

  @ApiProperty({ example: 'requirements' })
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiProperty({ example: 'IP whitelist' })
  @IsOptional()
  @IsString()
  ipWhitelist?: string;

  @ApiProperty({ example: 'allowed origins' })
  @IsOptional()
  @IsString()
  allowedOrigins?: string;

  @ApiProperty({ example: 'http://redirectafterpixel.com' })
  @IsOptional()
  @IsString()
  redirectAfterPixel?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  bypassIpWhitelist?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  checkOrigin?: boolean;

  @ApiProperty({ example: 'allowed referrer' })
  @IsOptional()
  @IsString()
  allowedReferrer?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  checkReferrer?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isKilled?: boolean;

  @ApiProperty({ example: 'http://imageurl.com' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  pu?: string;

  @IsOptional()
  @IsNumber()
  partner_uuid?: string;

  @ApiProperty({ example:1 })
  @IsOptional()
  @IsNumber()
  commissionProfileId?:number

  @ApiProperty({ example: 'IB' })
  @IsString()
  @IsOptional()
  utmSource?: string;
 
  @ApiProperty()
  @IsOptional()
  utmMedium?: string;

  @ApiProperty()
  @IsOptional()
  utmCampaign?: string;

  @ApiProperty()
  @IsOptional()
  campaignId?: string;

  @ApiProperty()
  @IsOptional()
  utmContent?: string;

  @ApiProperty()
  @IsOptional()
  utmTerm?: string;

  @ApiProperty({ example: 'IBRegistrationLink' })
  @IsString()
  @IsOptional()
  source?: string;


}
