import {
  IsString,
  IsNumber,
  IsEnum,
  Min,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderType {
  BUY = '0',
  SELL = '1',
  BUY_LIMIT = '2',
  SELL_LIMIT = '3',
  BUY_STOP = '4',
  SELL_STOP = '5',
  BUY_STOP_LIMIT = '6',
  SELL_STOP_LIMIT = '7',
}

export enum TypeFill {
  FOK = '0', // Fill or Kill
  IOC = '1', // Immediate or Cancel
  GTC = '2', // Good Till Cancelled
}

export class TradeRequestDto {
  @ApiProperty({
    description: 'Action code for the order',
    example: '200',
  })
  @IsString()
  @IsNotEmpty()
  readonly Action: string;

  @ApiProperty({
    description: 'Login ID of the trader',
    example: '1010',
  })
  @IsString()
  @IsNotEmpty()
  readonly Login: string;

  @ApiProperty({
    description: 'Trading symbol/pair',
    example: 'EURUSD',
  })
  @IsString()
  @IsNotEmpty()
  readonly Symbol: string;

  @ApiProperty({
    description: 'Trading volume',
    example: '0.01',
  })
  @IsString()
  @IsNotEmpty()
  readonly Volume: string;

  @ApiProperty({
    description: 'Type of order fill',
    enum: TypeFill,
    example: 0,
  })
  @IsEnum(TypeFill)
  readonly TypeFill: TypeFill;

  @ApiProperty({
    description: 'Order type',
    enum: OrderType,
    example: 0,
  })
  @IsEnum(OrderType)
  readonly Type: OrderType;

  @ApiProperty({
    description: 'Order price',
    example: '1.11850',
  })
  @IsString()
  @IsNotEmpty()
  readonly PriceOrder: string;

  @ApiProperty({
    description: 'Number of decimal places for the price',
    example: '5',
  })
  @IsString()
  @IsNotEmpty()
  readonly Digits: string;
}

class TradeRequestResultDto {
  @ApiProperty({
    description: 'Order ticket number',
    example: '123456',
  })
  @IsString()
  readonly id: string;
}
