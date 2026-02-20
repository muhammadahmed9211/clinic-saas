import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePartnerLinkUrlDto {
  @ApiProperty({ example: 'https://example.com/new-link' })
  @IsNotEmpty()
  @IsString()
  url: string;
}
