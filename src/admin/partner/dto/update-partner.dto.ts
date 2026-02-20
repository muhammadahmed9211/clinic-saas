import {
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ActiveStatus, Approved } from 'src/settings/entities/partner.entity';

export class UpdatePartnerDTO {
  @ApiProperty({ example: 'title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Contact Name' })
  @IsOptional()
  @IsString()
  contactName?: string;

  @ApiProperty({ example: 'email@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'password123' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: '1234567890' })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiProperty({ example: 'SPAIN' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: 'skype_id' })
  @IsOptional()
  @IsString()
  skype?: string;

  @ApiProperty({ example: 'exampleSecretApiKey' })
  @IsOptional()
  @IsString()
  apiKey?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  platformId?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  regulated?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  ib?: boolean;

  @ApiProperty({ example: 'ACTIVE/INACTIVE' })
  @IsEnum(ActiveStatus)
  @IsOptional()
  status?: ActiveStatus;

  @ApiProperty({ example: 'APPROVE' })
  @IsEnum(Approved)
  @IsOptional()
  approved?: Approved;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  referrerId?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  affiliateManagerId?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  appId?: number;

  @ApiProperty({ example: 0.1 })
  @IsOptional()
  @IsNumber()
  referralPercentage?: number;

  @ApiProperty({ example: 10 })
  @IsOptional()
  @IsNumber()
  dailyCount?: number;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  dailyLimit?: number;

  @ApiProperty({ example: 50 })
  @IsOptional()
  @IsNumber()
  minDepositAmount?: number;

  @ApiProperty({ example: '1' })
  @IsOptional()
  @IsString()
  externalId?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  maxPay?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  overPaid?: number;

  @ApiProperty({ example: "12345" })
  @IsOptional()
  @IsString()
  userIbId?: string;

  @ApiProperty({ example: '["Country1", "Country2"]' })
  @IsOptional()
  blockedCountry?: string[];

  @ApiProperty({ example: '["Country1", "Country2"]' })
  @IsOptional()
  allowedCountry?: string[];

  @ApiProperty({ example: 'Registration notes' })
  @IsOptional()
  @IsString()
  registrationNotes?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  bypassIpWhitelist?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  onlyShowFtds?: boolean;

  @ApiProperty({ example: '192.168.0.1, 10.0.0.1' })
  @IsOptional()
  @IsString()
  apiWhitelistIps?: string;

  @ApiProperty({ example: 'source1, source2' })
  @IsOptional()
  @IsString()
  blockedSources?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  trackVisit?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  trackVisitRL?: boolean;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  trackVisitRLInterval?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  registerUser?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  registerUserRL?: boolean;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  registerUserRLInterval?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  registerLead?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  registerLeadRL?: boolean;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  registerLeadRLInterval?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  getUser?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  getUserRL?: boolean;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  getUsersRLInterval?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  getDeposits?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  getDepositsRL?: boolean;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  getDepositsRLInterval?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  getStats?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  getStatsRL?: boolean;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  getStatsRLInterval?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  getSalesStatuses?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  getSalesStatusesRL?: boolean;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  getSalesRLInterval?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  getDeposit?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  getDepositRL?: boolean;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  getDepositRLInterval?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  syncUserTransaction?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  syncUserTransactionRL?: boolean;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  syncUserTransactionRLInterval?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  syncUserNote?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  syncUserNoteRL?: boolean;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  syncUserNoteRInterval?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  regenerateUserAutologinUrl?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  regenerateUserAutologinUrlRL?: boolean;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  regenerateUserAutologinUrlRLInterval?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  getUserClosedTrades?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  getUserClosedTradesRL?: boolean;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  getUserClosedTradesRLInterval?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  getWithdrawal?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  getWithdrawalRL?: boolean;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  getWithdrawalRLInterval?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  getWithdrawals?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  getWithdrawalsRL?: boolean;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  getWithdrawalsRLInterval?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  createAffiliate?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  createAffiliateRL?: boolean;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  createAffiliateRLInterval?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  getUserTransaction?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  getUserTransactionRL?: boolean;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  getUserTransactionRLInterval?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  getUserTransactions?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  getUserTransactionsRL?: boolean;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  getUserTransactionsRLInterval?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  getUsers?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  getUsersRL?: boolean;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  getUserRLInterval?: number;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  getUseRLInterval?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  partnerTypeId?: number;
}
