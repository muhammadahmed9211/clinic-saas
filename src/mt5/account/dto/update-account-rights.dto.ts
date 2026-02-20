import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class UpdateAccountRightsRequest {
  @ApiProperty({ required: false })
  @IsBoolean()
  allowLogin?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  allowTrade?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  allowPasswordChange?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  allowEnableOtp?: boolean;
  @ApiProperty({ required: false })
  @IsBoolean()
  calculateCommission?: boolean;
}

export class UpdateAccountRequestParams {
  @ApiProperty({ required: true })
  @IsString()
  login: string;
}

export class UpdateAccountTrade {
  @ApiProperty({ required: true })
  @IsBoolean()
  allowTrade: boolean;
}

