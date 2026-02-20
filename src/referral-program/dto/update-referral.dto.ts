import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsDateString,
  Min,
  IsEnum,
  Validate,
  IsUUID,
  IsInt,
} from 'class-validator';
import { ReferralProgramStatus, ReferralProgramType, RewardType } from '../entities/referral-program.entity';
import { i18nValidationMessage } from 'nestjs-i18n';
import { FileEntity } from 'src/files/entities/file.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';

export class UpdateReferralDto {
  @ApiPropertyOptional({ description: 'Referral title in English', example: 'Invite & Earn' })
  @IsString()
  @IsOptional()
  titleEn?: string;

  @ApiPropertyOptional({ description: 'Referral title in Arabic', example: 'ادعُ واربح' })
  @IsString()
  @IsOptional()
  titleAr?: string;

  @ApiPropertyOptional({ description: 'Referral description in English', example: 'Refer friends and get rewards.' })
  @IsString()
  @IsOptional()
  descriptionEn?: string;

  @ApiPropertyOptional({ description: 'Referral description in Arabic', example: 'أرسل دعواتك واحصل على مكافآت.' })
  @IsString()
  @IsOptional()
  descriptionAr?: string;

  @ApiPropertyOptional({ description: 'Amount to reward per referral', example: 25 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  rewardAmount?: number;

  @ApiPropertyOptional({ description: 'Maximum number of referrals allowed', example: 10 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maximumReferrals?: number;

  @ApiPropertyOptional({ description: 'Regulation name', example: 'FSCA' })
  @IsString()
  @IsOptional()
  regulation?: string;

  @ApiPropertyOptional({ description: 'List of country codes or IDs', example: ['UK', 'UAE', 'KSA'] })
  @IsArray()
  @IsOptional()
  country?: string[];

  @ApiPropertyOptional({ description: 'Start date and time for referral campaign', example: '2025-07-24T00:00:00Z' })
  @IsDateString()
  @IsOptional()
  startDateTime?: string;

  @ApiPropertyOptional({ description: 'End date and time for referral campaign', example: '2025-08-24T23:59:59Z' })
  @IsDateString()
  @IsOptional()
  endDateTime?: string;

  @ApiPropertyOptional({ description: 'Referral program code', example: 'REF-PROG-09' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ type: 'string', format: 'uuid', required: false })
  @IsOptional()
  @IsUUID()
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: i18nValidationMessage('errors.client.imageExist'),
  })
  image?: string;

  @ApiPropertyOptional({ description: 'Referral program type', enum: ReferralProgramType })
  @IsEnum(ReferralProgramType)
  @IsOptional()
  type?: ReferralProgramType;

  @ApiPropertyOptional({ description: 'Reward type', enum: RewardType })
  @IsEnum(RewardType)
  @IsOptional()
  rewardType?: RewardType;

  @ApiPropertyOptional({ description: 'Referral program status', enum: ReferralProgramStatus })
  @IsEnum(ReferralProgramStatus)
  @IsOptional()
  status?: ReferralProgramStatus;

  @ApiProperty({ 
  description: 'Challenge period in days', 
  example: 30,
  minimum: 1,
  type: 'integer',
  required: false 
  } )
  @IsOptional()  
  @IsInt()
  @Min(1)
  challengePeriod?: number; 
}