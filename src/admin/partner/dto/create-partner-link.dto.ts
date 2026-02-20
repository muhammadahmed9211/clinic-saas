import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsInt,
  IsBoolean,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class CreatePartnerLinkDto {
  @ApiProperty({
    example: 'This is a partner link for a casino',
    required: false,
    maxLength: 1020,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1020)
  description?: string;

  @ApiProperty({
    example: 'https://example.com/partner-link',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    example: 123,
    required: false,
  })
  @IsOptional()
  @IsInt()
  app?: number;

  @ApiProperty({
    example: 'Partner Link Name',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_published?: boolean;

  @ApiProperty({
    example: 'en',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  language_iso?: string;

  @ApiProperty({
    example: 'https://example.com/secondary-link',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  secondary_url?: string;

  @ApiProperty({
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_regulated?: boolean;

  @ApiProperty({
    example: 'casino',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  category?: string;

  @ApiProperty({
    example: 'https://example.com/link-image.jpg',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  image_url?: string;

  @ApiProperty({
    example: 'https://example.com/link-assets',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  assets_url?: string;

  @ApiProperty({
    example: 'slots',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  sub_category?: string;

  @ApiProperty({
    example: 'new',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  badge?: string;

  @ApiProperty({
    example: 'custom-visit-id',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  custom_visit_id?: string;

  @ApiProperty({
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_amp_forbidden?: boolean;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  replace_instead_of_add?: boolean;

  @ApiProperty({
    example: 'age>18',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  restrictions?: string;

  @ApiProperty({
    example: 'free-spins,bonus-cash',
    required: false,
  })
  @IsOptional()
  @IsString()
  promo_methods?: string;

  @ApiProperty({
    example: 'new-players-only',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  requirements?: string;

  @ApiProperty({
    example: 'https://example.com/line-view-image.jpg',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  line_view_image_url?: string;

  @ApiProperty({
    example: 'https://example.com/details-image.jpg',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  details_image_url?: string;

  @ApiProperty({
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  sort?: number;

  @ApiProperty({
    example: '192.168.1.1,192.168.1.2',
    required: false,
  })
  @IsOptional()
  @IsString()
  ip_white_list?: string;

  @ApiProperty({
    example: 'https://example.com,https://example.org',
    required: false,
  })
  @IsOptional()
  @IsString()
  allowed_origins?: string;

  @ApiProperty({
    example: 'https://referrer.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  allowed_referrer?: string;

  @ApiProperty({
    example: 'https://example.com/redirect',
    required: false,
  })
  @IsOptional()
  @IsString()
  redirect_after_pixel?: string;

  @ApiProperty({
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  bypass_ip_whitelist?: boolean;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  check_origin?: boolean;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  check_referrer?: boolean;

  @ApiProperty({
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_killed?: boolean;
}
