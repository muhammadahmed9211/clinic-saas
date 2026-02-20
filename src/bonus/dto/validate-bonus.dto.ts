import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateBonusDto {
  @ApiProperty({
    description: 'Bonus code to validate',
    example: 'WELCOME100',
  })
  @IsString()
  bonusCode: string;

  @ApiProperty({
    description: 'Deposit amount to check eligibility',
    example: 150,
  })
  @IsNumber()
  amount: number;
}
