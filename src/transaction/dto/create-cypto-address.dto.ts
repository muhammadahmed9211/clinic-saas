import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum COINS {
  ETH = 'ETH',
  BTC = 'BTC',
  USDT = 'USDT',
}
export class CreateCryptoAddress {
  @ApiProperty({ enum: COINS })
  @IsEnum(COINS)
  coin: string;
}
