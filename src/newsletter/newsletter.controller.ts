import {
  Controller,
  Body,
  HttpStatus,
  HttpCode,
  Post,
  Param,
  Patch,
} from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateSubscriptionDto } from './dto/createSubscription.dto';
import { response_message } from 'src/constants/messages';
import { VerifySubscriptionDto } from './dto/verifySubscription';
import { ContactUsDto } from './dto/contactUs.dto';

@ApiTags('Newsletter Subscription')
@Controller({
  path: 'newsletter',
  version: '1',
})
export class NewsletterController {
  constructor(private readonly newsletterKycService: NewsletterService) { }

  @Post('/subscriptions')
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<any> {
    const data = await this.newsletterKycService.createSubscription(
      createSubscriptionDto,
    );
    return { status: true, message: response_message.SUCCESS, data };
  }

  @Patch('/subscriptions/otp')
  @HttpCode(HttpStatus.OK)
  async verifySubscriptionOtp(
    @Body() otp: VerifySubscriptionDto,
  ): Promise<any> {
    const data = await this.newsletterKycService.verifySubscriptionOtp(otp);
    return data;
  }

  @Patch('/subscriptions/:hash')
  @HttpCode(HttpStatus.OK)
  async subscribe(@Param('hash') hash: string): Promise<any> {
    try {
      const data = await this.newsletterKycService.subscribe(hash);
      return { status: true, message: response_message.SUCCESS, data };
    } catch (error) {
      return { status: false, message: response_message.NOT_FOUND, error };
    }
  }

  @Post('/contact-us')
  @HttpCode(HttpStatus.OK)
  async contactUs(
    @Body() contactUsDto: ContactUsDto,
  ): Promise<any> {
    try {
      const data = await this.newsletterKycService.contactUs(
        contactUsDto,
      );
      return { status: true, message: "Email sent successfully", data };
    } catch (error) {
      return { status: false, message: "Email not sent" };
    }
  }

}
