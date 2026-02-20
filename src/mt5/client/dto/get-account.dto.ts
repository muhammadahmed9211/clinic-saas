import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GetAccountsRequest {
  @ApiProperty({
    required: true,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  userId: string;
}

export class GetAccountsRequestQuery {
  @ApiProperty({ required: false })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  login?: string;
}
