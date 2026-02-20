//service

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { newsletter_subscriptions } from './entity/newsletter.entity';
import { CreateSubscriptionDto } from './dto/createSubscription.dto';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { MailerService } from 'src/mailer/mailer.service';
import crypto from 'crypto';
import { MailSenderType } from 'src/email/dto/mail.send.dto';
import { OtpService } from 'src/otp/otp.service';
import { VerifySubscriptionDto } from './dto/verifySubscription';
import { I18nContext } from 'nestjs-i18n';
import { ContactUsDto } from './dto/contactUs.dto';
import { ContactUs } from './entity/contact-us.entity';
import { SendEmailService } from 'src/common/services/send-email.service';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(newsletter_subscriptions)
    private newsletterSubscriptionsRepository: Repository<newsletter_subscriptions>,
    @InjectRepository(ContactUs)
    private contactUsRepository: Repository<ContactUs>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly otpService: OtpService,
    private readonly sendEmailService:SendEmailService
  ) { }

  async createSubscription(data: CreateSubscriptionDto) {
    try {
      let { subscriptions } = data;
      if (!subscriptions) {
        subscriptions = [];
      }

      const hashBuffer = crypto.randomBytes(16);

      const genHash = crypto.createHash('sha256');
      genHash.update(hashBuffer);

      const hash = genHash.digest('hex');
      const isVerified = false;

      const document = this.newsletterSubscriptionsRepository.create({
        ...data,
        hash,
        isVerified,
        subscriptions: JSON.stringify(subscriptions),
      });

      const isExist = await this.newsletterSubscriptionsRepository.findOne({
        where: {
          email: data.email,
        },
      });
      if (isExist) {
        //if already exist then document will be updated
        document.id = isExist.id;
        let errorMsg = 'Already subscribed!';
        let givenLang = data.lang;
        const isCountryExist = data?.lang?.includes('-');
        if (isCountryExist) {
          const langSplit = data.lang.split('-');
          if (langSplit[1]) {
            givenLang = langSplit[1];
          }
        }
        const messages = {
          ar: 'مشترك بالفعل',
          ur: 'پہلے ہی سبسکرائب کیا گیا ہے',
        };
        if (messages[givenLang]) {
          errorMsg = messages[givenLang];
        }
        //if already verified error will be thrown
        if (isExist.isVerified) {
          throw new BadRequestException({
            message: errorMsg,
          });
        }
      }

      const savedDocument =
        await this.newsletterSubscriptionsRepository.save(document);

      const { otp } = await this.otpService.getNewsletterSubscriptionOTP({
        email: data.email,
      });

      let typeOfContent = '';
      subscriptions.forEach((sub) => {
        typeOfContent = `${typeOfContent} , ${sub.name}`;
      });

      if (savedDocument) {
        const title = data.name;
        const frontEndLink = this.configService.get(
          'app.frontendWebsiteDomain',
          {
            infer: true,
          },
        );
        let baseLink = frontEndLink;
        if (data.lang) {
          baseLink = `${baseLink}/${data.lang}`;
        }
        const confirmLink = `${baseLink}/blogs-v2/subscription-confirmed?hash=${hash}`;
        console.log(confirmLink, 'LINK');
        const subject = 'Newsletter Subscription';
        await this.mailerService.sendEmail({
          from: MailSenderType.NO_REPLY,
          to: data.email,
          subject: subject,
          context: {
            actionTitle: subject,
            title,
            app_name: this.configService.get('app.name', {
              infer: true,
            }),
            companyName: process.env.DOMAIN ? process.env.DOMAIN : 'Example',
            userName: title,
            confirmEmailLink: confirmLink,
            otpCode: otp,
            typeOfContent: typeOfContent,
            faqPageLink: `${baseLink}/faq/`,
          },
          templateName: 'NEWSLETTER_SUBSCRIPTION',
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hash: _, ...newsletter } = savedDocument;
      return {
        ...newsletter,
        subscriptions: JSON.parse(
          savedDocument.subscriptions.replace(/\\"/g, '"'),
        ),
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  async subscribe(hash: string) {
    const i18n = I18nContext.current();
    try {
      const isExist = await this.newsletterSubscriptionsRepository.findOne({
        where: {
          hash,
        },
      });
      if (!isExist) {
        const message = await i18n?.t('errors.newsletter.invalidUrl');
        throw new NotFoundException({
          message: message,
        });
      }

      if (isExist.isVerified) {
        const message = await i18n?.t('errors.newsletter.alreadyVerify');
        throw new UnprocessableEntityException({
          message: message,
        });
      }

      isExist.isVerified = true;
      const savedDocument =
        await this.newsletterSubscriptionsRepository.save(isExist);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hash: _, ...newsletter } = savedDocument;
      return {
        ...newsletter,
        subscriptions: JSON.parse(
          savedDocument.subscriptions.replace(/\\"/g, '"'),
        ),
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  async verifySubscriptionOtp(otp: VerifySubscriptionDto) {
    const i18n = I18nContext.current();
    const isOTPVerified =
      await this.otpService.verifyNewsletterSubscriptionOTP(otp);
    if (!isOTPVerified) {
      const message = await i18n?.t('errors.otp.invalidOtp');
      throw new UnprocessableEntityException({
        message: message,
      });
    }
    const isVerified = await this.newsletterSubscriptionsRepository.update(
      { email: otp.email },
      { isVerified: true },
    );
    if (!isVerified) {
      const message = await i18n?.t('errors.otp.errorVerifying');
      throw new UnprocessableEntityException({
        message: message,
      });
    }
    return { isVerified: isVerified.affected === 1 };
  }

  async contactUs(data: ContactUsDto) {
    const contactUs = this.contactUsRepository.create(data);
   const saved = await this.contactUsRepository.save(contactUs);
  const text = data.text || "";

  const firstName = text.match(/First Name:\s*(.*)/)?.[1]?.trim() || "";
  const lastName = text.match(/Last Name:\s*(.*)/)?.[1]?.trim() || "";
  const phone = text.match(/Phone Number:\s*(.*)/)?.[1]?.trim() || "";
  const email = text.match(/Email:\s*(.*)/)?.[1]?.trim() || "";
  const message = text.match(/Message:\s*([\s\S]*)/)?.[1]?.trim() || "";
  const imageLink = text.match(/Image Link:\s*(.*)/)?.[1]?.trim() || "";
  const tradingAccount = text.match(/Trading Account:\s*(.*)/)?.[1]?.trim() || "";
  const issue = text.match(/Issue:\s*(.*)/)?.[1]?.trim() || "";
  const experience = text.match(/Experience:\s*(.*)/)?.[1]?.trim() || "";
const now = new Date();

const formattedDate = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
}).format(now); // e.g., 26 Aug 2025

const formattedTime = now.toLocaleTimeString('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
}); // e.g., 3:45 PM

  // pass extracted data in manualData
  await this.sendEmailService.sendEmailToOperatorWithoutVariable({
    emailEventName: 'CONTACT_US_SUPPORT',
    from: this.configService.getOrThrow('mail.ticketReplyEmail', { infer: true }),
    to:  this.configService.getOrThrow('mail.ticketReplyEmail', { infer: true }),
    subject:`Contact Form Submission - Website/App ${formattedDate} ${formattedTime}`,
    manualData: {
      firstName,
      lastName,
      phone,
      email,
      message,
      imageLink,
      tradingAccount,
      issue,
      experience,
    }
  });
   
  return saved;
}
}
