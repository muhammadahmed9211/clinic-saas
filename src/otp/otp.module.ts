import { forwardRef, Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { TwilioModule } from 'nestjs-twilio';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserVerification } from 'src/users/entities/user_verification.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/mail/mail.module';
import { Otp } from 'src/users/entities/otp.entity';
import { ClientsModule } from 'src/users/clients.module';
import { User } from 'src/users/entities/user.entity';
import { TicketsModule } from 'src/ticket-management/tickets.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => AuthModule),
    forwardRef(() => TicketsModule),
    OtpModule,
    MailModule,
    ClientsModule,
    TypeOrmModule.forFeature([UserVerification, Otp, User]),
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
  ],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
