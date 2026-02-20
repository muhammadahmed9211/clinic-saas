import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class NotificationsSettingsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isEmailNotificationsEnabled?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isWhatsappNotificationsEnabled?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isSmsNotificationsEnabled?: boolean;
}
