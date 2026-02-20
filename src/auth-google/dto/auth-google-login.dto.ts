import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import { SearchParamsDto } from './search-params.dto';

export class AuthGoogleLoginDto {
  @ApiProperty({ example: 'abc' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  idToken: string;

  @ApiProperty({ 
    type: SearchParamsDto,
    example: {
      type: 'ib',
      partner_uuid: 'EA23E4BC-0423-4F44-842A-B7BE18E69D34',
      source: 'IBRegistrationLink',
      utmSource: 'IB',
      commissionProfileId: 86,
      p1: 'p1',
      p2: 'p2',
      p3: 'p3',
      p4: 'p4',
      p5: 'p5',
      p6: 'p6',
      pu: true,
      utmMedium: 'utmMedium',
      utmCampaign: 'utmCampaign',
      utmContent: 'utmContent',
      utmTerm: 'utmTerm',
      campaignId: 'campaignId',
      partnerTypeId: 1,
    },
    required: false 
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SearchParamsDto)
  searchParams?: SearchParamsDto;
}
