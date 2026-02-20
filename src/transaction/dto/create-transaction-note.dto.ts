import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateTransactionNote {
  @ApiProperty({ example: 'Transaction Note' })
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  note: string;

  @ApiProperty({ example: 'FB23433E-F36B-1410-8F7A-001268AAE5F5' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  file_id?: string;
}

export class UpdateTransactionNote {
  @ApiProperty({ example: 'Transaction Note' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  note: string;

  @ApiProperty({ example: 'FB23433E-F36B-1410-8F7A-001268AAE5F5' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  file_id?: string;
}