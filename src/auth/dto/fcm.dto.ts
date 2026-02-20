import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SaveFcmTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'your-fcm-token' })
  fcmToken: string;
}
