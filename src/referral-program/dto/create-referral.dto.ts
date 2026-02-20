import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
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
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { FileEntity } from 'src/files/entities/file.entity';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateReferralDto {
  @ApiProperty({ description: 'Referral title in English', example: 'Invite & Earn' })
  @IsString()
  @IsNotEmpty()
  titleEn: string;

  @ApiProperty({ description: 'Referral title in Arabic', example: 'ادعُ واربح' })
  @IsString()
  @IsNotEmpty()
  titleAr: string;

  @ApiProperty({ description: 'Referral description in English', example: 'Refer friends and get rewards.' })
  @IsString()
  @IsNotEmpty()
  descriptionEn: string;

  @ApiProperty({ description: 'Referral description in Arabic', example: 'أرسل دعواتك واحصل على مكافآت.' })
  @IsString()
  @IsNotEmpty()
  descriptionAr: string;

//  @ApiProperty({ description: 'Rule group ID for referral condition', example: 2 })
//   @IsNumber()
//   @IsOptional()
//   ruleGroupId: number;

  @ApiProperty({ description: 'Amount to reward per referral', example: 25 })
  @IsNumber()
  @Min(0)
  rewardAmount: number;

  @ApiProperty({
    description: 'Maximum number of referrals allowed (optional)',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maximumReferrals?: number;

  @ApiProperty({ description: 'Regulation name', example: 'FSCA' })
  @IsString()
  @IsOptional()
  regulation?: string;

  @ApiProperty({
    description: 'List of country codes or IDs',
    example: ['UK', 'UAE', 'KSA'],
  })
  @IsArray()
 @IsOptional()
  country: string[];

  @ApiProperty({
    description: 'Start date and time for referral campaign',
    example: '2025-07-24T00:00:00Z',
  })
  @IsDateString()
  startDateTime: string;

  @ApiProperty({
    description: 'End date and time for referral campaign',
    example: '2025-08-24T23:59:59Z',
  })
  @IsDateString()
  endDateTime: string;

  
  @ApiProperty({ description: 'Referral program code', example: 'REF-PROG-09', required: false })
  @IsNotEmpty()
  @IsString()
  code?: string;

  @ApiProperty({ type: 'string', format: 'uuid', required: false })
  @IsOptional()
  @IsUUID()
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: i18nValidationMessage('errors.client.imageExist'),
  })
  image?: string;

  @ApiProperty({
    description: 'Referral program type',
    enum: ReferralProgramType,
    example: ReferralProgramType.SINGLE_TIER,
  })
  @IsEnum(ReferralProgramType)
  type: ReferralProgramType;

  @ApiProperty({
    description: 'Reward type',
    enum: RewardType,
    example: RewardType.AMOUNT,
  })
  @IsEnum(RewardType)
  rewardType: RewardType;

  
  @ApiProperty({
    description: 'Referral program status',
    enum: ReferralProgramStatus,
    example: ReferralProgramStatus.DRAFT,
  })
  @IsEnum(ReferralProgramStatus)
  status: ReferralProgramStatus;

  @ApiProperty({ 
    description: 'Challenge period in days', 
    example: 30,
    minimum: 1,
    type: 'integer'
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  challengePeriod: number; 
}