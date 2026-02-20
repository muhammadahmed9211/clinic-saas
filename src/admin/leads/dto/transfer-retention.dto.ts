import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class TransferRetentionDto {
  @ApiProperty({ example: true })
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  isTransferToRetention: boolean;
} 