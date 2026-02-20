import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UploadDataDto {
  @ApiProperty({ example: 'admin@example.com', required: true })
  @IsEmail({}, { message: 'invalid email' })
  email?: string;

  @ApiProperty({ required: false })
  @IsString({ message: 'should be string' })
  firstName?: string;

  @ApiProperty({ required: false })
  @IsString({ message: 'should be string' })
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber({}, { message: 'should be a number' })
  telephone?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber({}, { message: 'should be a number' })
  telephonePrefix?: number;

  @ApiProperty({ required: false })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: 'should be string' })
  country?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'should be string' })
  language?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'should be string' })
  source?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'should be string' })
  partnerUuid?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'should be number' })
  Retention?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'should be a number' })
  internalSalesStatus?: number;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'should be string' })
  isBlockEmails?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString({ message: 'should be string' })
  p1?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString({ message: 'should be string' })
  p2?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString({ message: 'should be string' })
  p3?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString({ message: 'should be string' })
  p4?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString({ message: 'should be string' })
  p5?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString({ message: 'should be string' })
  p6?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString({ message: 'should be string' })
  utmSource?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString({ message: 'should be string' })
  utmCampaign?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString({ message: 'should be string' })
  utmTerm?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString({ message: 'should be string' })
  utmMedium?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString({ message: 'should be string' })
  utmContent?: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'should be string' })
  speakingLanguage?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString({ message: 'should be string' })
  cq_interestTrading?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString({ message: 'should be string' })
  cq_aboveEighteen?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString({ message: 'should be string' })
  cq_tradingExperience?: string;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber({}, { message: 'should be number' })
  cq_expectedDeposit?: number;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString({ message: 'should be string' })
  cq_bestTimeToCall?: string;
}
