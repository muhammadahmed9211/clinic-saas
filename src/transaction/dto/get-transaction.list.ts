import {
  IsNumber,
  IsOptional,
  IsEnum,
  IsUUID,
  IsDateString,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  TransactionStatus,
  TransactionType,
} from '../entities/transaction.entity';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { Methods as TransactionMethods } from '../entities/transaction-method.entity';

export class GetTransactionList extends PaginationDto {
  @ApiProperty({
    example: '6E08433E-F36B-1410-8528-00DD52555502',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({
    example: '1020',
    required: false,
  })
  @IsOptional()
  @IsString()
  login?: string;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  amount?: number;

  @ApiProperty({ example: TransactionType.DEPOSIT, required: false })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiProperty({ example: TransactionMethods.CREDIT_CARD, required: false })
  @IsOptional()
  @IsEnum(TransactionMethods)
  method?: TransactionMethods;

  @ApiProperty({ example: TransactionStatus.PENDING, required: false })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @IsDateString()
  from?: Date;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @IsDateString()
  to?: Date;
}
