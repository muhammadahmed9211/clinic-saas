import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class SendPushNotificationDto {
  @ApiProperty({ example: 'dskfj39r23r9fdskfj239' })
  @IsString()
  fcmToken: string;

  @ApiProperty({ example: 'Notification Title' })
  @IsString()
  priority: string;

  @ApiProperty({
    example: { title: 'Notification Title', body: 'This is a notification' },
  })
  @IsOptional()
  notification: {
    title?: string;
    body?: string;
  };

  @ApiProperty({
    example: {
      key1: 'value1',
      key2: 'value2',
      title: 'Notification Title',
      body: 'This is a notification',
    },
    required: false,
  })
  data?: Record<string, string>;
}

export type NotificationChannel = 'push' | 'email' | 'whatsapp' | 'sms';

export class PushChannelConfig {
  @IsString()
  @IsOptional()
  deepLink?: string;

  @IsString()
  @IsOptional()
  deeplinkTarget?: string; // Alternative to deepLink

  @IsEnum(['high', 'normal', 'low'])
  @IsOptional()
  priority?: 'high' | 'normal' | 'low';

  @IsObject()
  @IsOptional()
  data?: Record<string, string>; // Custom key-value pairs

  // iOS APNs specific fields
  @IsString()
  @IsOptional()
  sound?: string; // e.g., 'custom_sound.aiff'

  @IsNumber()
  @IsOptional()
  badge?: number; // Badge count

  @IsBoolean()
  @IsOptional()
  mutableContent?: boolean; // iOS 10+ for notification service extension

  // Custom data fields (from SAP examples)
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsEnum(['COUPON', 'OFFER', 'TEXT'])
  @IsOptional()
  type?: 'COUPON' | 'OFFER' | 'TEXT';

  @IsString()
  @IsOptional()
  scenarioId?: string;

  @IsString()
  @IsOptional()
  offerId?: string;

  @IsString()
  @IsOptional()
  offerName?: string;

  @IsString()
  @IsOptional()
  offerCoupon?: string;

  @IsString()
  @IsOptional()
  offerImage?: string;

  @IsString()
  @IsOptional()
  offerTarget?: string;

  @IsString()
  @IsOptional()
  offerCouponCode?: string;

  @IsString()
  @IsOptional()
  offerEANCodeImageURL?: string;

  @IsString()
  @IsOptional()
  offerQRCodeImageURL?: string;

  @IsString()
  @IsOptional()
  offerCouponCodeSerialNumber?: string;

  @IsString()
  @IsOptional()
  trackingURL?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  clickAction?: string; // e.g., 'OPEN_NOTIFICATION'

  @IsString()
  @IsOptional()
  campaignID?: string;
}

export class EmailChannelConfig {
  @IsString()
  @IsOptional()
  subject?: string; // Email subject

  @IsString()
  @IsOptional()
  body?: string; // Email body (NO header/footer for AI-generated emails)

  @IsString()
  @IsOptional()
  htmlBody?: string; // Full HTML body (with header/footer if applicable)

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: Array<{
    filename: string;
    content: string;
    contentType: string;
  }>;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cc?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  bcc?: string[];
}

export class WhatsAppChannelConfig {
  @IsString()
  @IsOptional()
  templateName?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  templateParams?: string[];
}

export class SmsChannelConfig {
  @IsString()
  @IsOptional()
  senderId?: string;
}

export class ChannelPreferences {
  @IsBoolean()
  @IsOptional()
  push?: boolean;

  @IsBoolean()
  @IsOptional()
  email?: boolean;

  @IsBoolean()
  @IsOptional()
  whatsapp?: boolean;

  @IsBoolean()
  @IsOptional()
  sms?: boolean;
}

export class SendPushNotificationRequest {
  // User Identification
  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsString()
  @IsOptional()
  clientId?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  deviceToken?: string;

  // Event Context
  @IsString()
  eventType: string;

  @IsString()
  @IsOptional()
  eventId?: string;

  @IsString()
  source: string;

  // Channel Selection
  @IsArray()
  @IsEnum(['push', 'email', 'whatsapp', 'sms'], { each: true })
  @IsOptional()
  channels?: NotificationChannel[];

  @ValidateNested()
  @Type(() => ChannelPreferences)
  @IsOptional()
  channelPreferences?: ChannelPreferences;

  // Content
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  body?: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsOptional()
  templateCode?: string;

  @IsObject()
  @IsOptional()
  templateVariables?: Record<string, any>;

  // Channel-Specific Overrides
  @ValidateNested()
  @Type(() => PushChannelConfig)
  @IsOptional()
  push?: PushChannelConfig;

  @ValidateNested()
  @Type(() => EmailChannelConfig)
  @IsOptional()
  email?: EmailChannelConfig;

  @ValidateNested()
  @Type(() => WhatsAppChannelConfig)
  @IsOptional()
  whatsapp?: WhatsAppChannelConfig;

  @ValidateNested()
  @Type(() => SmsChannelConfig)
  @IsOptional()
  sms?: SmsChannelConfig;

  // Metadata
  @IsString()
  @IsOptional()
  locale?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
