import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RestrictionType } from 'src/transaction/entities/psp.entity';

export enum PspTypes {
  CRYPTO = 'Crypto',
  E_WALLETS = 'E Wallets',
  CREDIT_CARD = 'Credit Card',
  BANK = 'Bank',
  ALL='ALL',
  Exchange='Exchange'
}

enum FeeType {
  AMOUNT = 'AMOUNT',
  PERCENTAGE = 'PERCENTAGE',
}


export class CreatePspDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Value must be zero or a positive number' })
  aggregatorId: number;

  @ApiProperty({ example: 'New PSP' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: PspTypes })
  @IsOptional()
  @IsEnum(PspTypes)
  type: PspTypes;

  @ApiProperty({ enum: FeeType })
  @IsNotEmpty()
  @IsEnum(FeeType)
  depositFeeType: FeeType;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Value must be zero or a positive number' })
  depositFee: number;

  @ApiProperty({ enum: FeeType })
  @IsNotEmpty()
  @IsEnum(FeeType)
  withdrawalFeeType: FeeType;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Value must be zero or a positive number' })
  withdrawalFee: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Value must be zero or a positive number' })
  rollover: number;

  @ApiProperty({ enum: FeeType })
  @IsNotEmpty()
  @IsEnum(FeeType)
  clientDepositFeeType: FeeType;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Value must be zero or a positive number' })
  clientDepositFee: number;

  @ApiProperty({ enum: FeeType })
  @IsNotEmpty()
  @IsEnum(FeeType)
  clientWithdrawalFeeType: FeeType;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Value must be zero or a positive number' })
  clientWithdrawalFee: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Value must be zero or a positive number' })
  depositLimit: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Value must be zero or a positive number' })
  withdrawalLimit: number;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'An array of integers, must contain at least 1 item.',
  })
  @IsArray({ message: 'Regulation Ids must be array' })
  @IsNumber(
    { allowNaN: false },
    { each: true, message: 'Regulation Id must be number' },
  )
  regulationsId: number[];

  @ApiProperty({ enum: FeeType })
  @IsOptional()
  @IsEnum(FeeType)
  depositCommissionType: FeeType;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Value must be zero or a positive number' })
  depositCommission: number;

  @ApiProperty({ enum: FeeType })
  @IsOptional()
  @IsEnum(FeeType)
  withdrawalCommissionType: FeeType;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Value must be zero or a positive number' })
  withdrawalCommission: number;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'An array of integers, must contain at least 1 item.',
  })
  @IsArray({ message: 'Methods Ids must be array' })
  @IsNumber(
    { allowNaN: false },
    { each: true, message: 'Methods Id must be number' },
  )
  methodsId: number[];

  @ApiProperty({
    example: true,
    description: 'Indicates whether the PSP is regulation restricted.',
  })
  @IsNotEmpty()
  @IsBoolean({ message: 'isRegulationRestricted must be a boolean value' })
  isRegulationRestricted: boolean;

  @ApiProperty({ enum: RestrictionType })
  @IsNotEmpty()
  @IsEnum(RestrictionType, {
    message: 'regulationRestrictionType must be a valid RestrictionType',
  })
  regulationRestrictionType: RestrictionType;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Value must be zero or a positive number' })
  depositMinLimit: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Value must be zero or a positive number' })
  depositMaxLimit: number;
}
