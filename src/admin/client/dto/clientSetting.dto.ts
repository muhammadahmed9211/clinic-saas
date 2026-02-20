import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class ClientSettingDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  testUserMode?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isPhoneValid?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isSecondPhoneValid?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isEmailConfirmed?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isUserConverted?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isProTrader?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isShowInvestments?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isAutomaticTransfer?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isAllowTransactions?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isSuspiciousUser?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isBlockAllCommunications?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isBlockSendingEmails?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isProblematicClient?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isBlockClientArea?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isBonusAbuser?: boolean;
}
