// module

import { Module } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { newsletter_subscriptions } from './entity/newsletter.entity';
import { IsExist } from '../utils/validators/is-exists.validator';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';
import { MailerModule } from 'src/mailer/mailer.module';
import { OtpModule } from 'src/otp/otp.module';
import { ContactUs } from './entity/contact-us.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MailerModule,
    MailModule,
    OtpModule,
    TypeOrmModule.forFeature([newsletter_subscriptions, ContactUs]),
  ],
  controllers: [NewsletterController],
  providers: [IsExist, IsNotExist, NewsletterService],
  exports: [NewsletterService],
})
export class NewsletterModule { }
