import {
  BadRequestException,
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TwilioService } from 'nestjs-twilio';
import { AuthService } from 'src/auth/auth.service';
import { AllConfigType } from 'src/config/config.type';
import { UserVerification } from 'src/users/entities/user_verification.entity';
import { now_ts } from 'src/utils/utility';
import { MoreThan, Repository } from 'typeorm';
import { SendOtpEmailDTO } from './dto/send_otp_email.dto';
import otpGenerator from 'otp-generator';
import { MailService } from 'src/mail/mail.service';
import { Otp, OtpTypes } from 'src/users/entities/otp.entity';
import { VerifyOtpEmailDTO } from './dto/verify_otp_email.dto';
import { User } from 'src/users/entities/user.entity';
import { I18nContext } from 'nestjs-i18n';
import { OtpSendDto } from './dto/otp-send.dto';
import { SendOtpLoginEmailDTO } from './dto/send_otp_login_email.dto';
import { OtpVerifyLoginDto } from './dto/otp-verify-login.dto';
import bcrypt from 'bcryptjs';
import { SendEmailService } from 'src/common/services/send-email.service';
import { stringify } from 'querystring';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    @InjectRepository(UserVerification)
    private readonly userVerificationRepository: Repository<UserVerification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly twilioService: TwilioService,
    private configService: ConfigService<AllConfigType>,
    private authService: AuthService,
    private readonly sendEmailService: SendEmailService,
  ) {}

  validateRecaptcha = async (
    recaptchaToken: string,
    userIpAddress: string,
    userAgent: string,
  ) => {
    const i18n = I18nContext.current();
    const projectId = process.env.GOOGLE_RECAPTCHA_PROJECT_ID || 'siliconfort-com';
    const apiKey = process.env.GOOGLE_RECAPTCHA_SECRET;
    
    if (!apiKey) {
      const message = await i18n?.t('errors.otp.recaptchaValidationFailed');
      throw new UnprocessableEntityException('reCAPTCHA API key is not configured');
    }

    const raw = JSON.stringify({
      event: {
        token: recaptchaToken,
        siteKey: process.env.GOOGLE_RECAPTCHA_SITE_KEY,
        expectedAction: 'sendOtp',
        userAgent,
        userIpAddress,
      },
    });
    const recaptchaResponse = await fetch(
      `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        body: raw,
      },
    );

    const recaptchaData = await recaptchaResponse.json();
    console.log(recaptchaData, 'Recaptcha Response');

    // Check for API errors first
    if (!recaptchaResponse.ok || recaptchaData.error) {
      console.error('reCAPTCHA API Error:', recaptchaData);
      const message = await i18n?.t('errors.otp.recaptchaValidationFailed');
      throw new UnprocessableEntityException(message);
    }

    if (
      !recaptchaData.tokenProperties ||
      recaptchaData.riskAnalysis?.score <
        parseFloat(process.env.GOOGLE_RECAPTCHA_SCORE || '0.7')
    ) {
      const message = await i18n?.t('errors.otp.recaptchaValidationFailed');
      throw new UnprocessableEntityException(message)
    } else {
      const isSuccess = i18n?.t('success.otp.recaptchaVerification');
      return {
        code: 200,
        success: true,
        message: isSuccess,
        result: recaptchaData,
      };
    }
  };

  async sendMobileOtp(
    otpSendDto: OtpSendDto & { type?: OtpTypes },
    userAgent: string,
    deviceId: string,
    language: string,
    headers: any,
    userIp: string,
    shouldByPassRecaptcha: boolean = false,
  ): Promise<any> {
    try {
      const i18n = I18nContext.current();
      if (!deviceId) {
        // const message = await i18n?.t('errors.otp.recaptchaValidationFailed');
        throw new UnprocessableEntityException('Device id is missing')
      }

      const { telephone, telephonePrefix, email, recaptchaToken, firstName } = otpSendDto;
      const mobile = telephonePrefix && telephone ? `+${telephonePrefix}${telephone}` : '';

      if (!shouldByPassRecaptcha) {
        const resultRecaptcha = await this.validateRecaptcha(
          recaptchaToken,
          userAgent,
          userIp,
        );

        if (resultRecaptcha.code === 400) {
          const i18n = I18nContext.current();
          const message = await i18n?.t('errors.otp.recaptchaValidationFailed');
          throw new UnprocessableEntityException(message)
        }
      }

      if (otpSendDto?.type !== OtpTypes.verify_transaction) {
        const isExist = await this.authService.emailExists({ email });
        if (isExist) {
          const message = await i18n?.t('errors.auth.emailExists');
          throw new UnprocessableEntityException(message)
        }
      }
      const headerUrl = headers.origin;
      const allowedDomain = this.configService.getOrThrow(
        'app.allowedDomains',
        {
          infer: true,
        },
      );

      const domain = allowedDomain.find((d) => headerUrl.includes(d));

      if (!domain) {
        throw new UnprocessableEntityException('Invalid Domain')
      }

      const thresholdTime =
        now_ts() -
        this.configService.getOrThrow('app.otpThreshold', { infer: true });
      const thresholdTimeForDevice =
        now_ts() -
        this.configService.getOrThrow('app.deviceIdOtpThreshold', {
          infer: true,
        });

      console.log(
        '+++++++++++++++++++++++',
        thresholdTime,
        thresholdTimeForDevice,
      );

      const lastFiveMinOTP = await this.userVerificationRepository.count({
        where: {
          createdAt: MoreThan(thresholdTime),
          verificationType: 'email_mobile',
        },
      });

      const lastDeviceThresholdCount =
        await this.userVerificationRepository.count({
          where: {
            createdAt: MoreThan(thresholdTimeForDevice),
            deviceId,
            verificationType: 'email_mobile',
          },
        });

      const thresholdCount = this.configService.getOrThrow(
        'app.otpThresholdCount',
        {
          infer: true,
        },
      );

      const deviceIdThresholdCount = this.configService.getOrThrow(
        'app.deviceIdOtpThresholdCount',
        {
          infer: true,
        },
      );

      let sid;

      const generatedOtp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });

      await this.otpRepository.update({ email }, { isActive: false });

      const otp = await this.otpRepository.save(
        this.otpRepository.create({
          email,
          otp: generatedOtp,
          type: otpSendDto?.type ? otpSendDto?.type : OtpTypes.verify_email,
          isActive: true,
          expires: new Date(Date.now() + 15 * 60 * 1000),
        }),
      );

      const systemOperator = await this.userRepository.findOne({
        where: { operator: { full_name: 'System' } },
        relations: { operator: true },
      });

      if(!systemOperator) {
        throw new BadRequestException('System operator not found')
      }

      const regulationId = await this.authService.findRegulationId(otpSendDto?.regulations??'FSCA')
      await this.sendEmailService.sendEmailToAnyone({
        entityName: 'otp',
        entityValue: otp.id as any,
        language,
        regulationId,
        email,
        emailEventName: 'OTP_EMAIL',
        operatorId: systemOperator.operator.id,
        externalVariables: { firstName: firstName ? firstName: 'Hello' }
      });

      const data = {
        email,
        mobile,
        sid: sid || 'Not applicable for email',
        deviceId,
        verificationType: sid ? 'email_mobile' : 'email',
        isMobileVerified: false,
        reason: otpSendDto?.type ? otpSendDto?.type : OtpTypes.verify_mobile,
        isEmailVerified: false,
        isActive: true,
        createdAt: now_ts(),
      };

      const isAllInActiveEmail = await this.userVerificationRepository.update(
        { email },
        { isActive: false },
      );

      const isAllInActiveMobile = await this.userVerificationRepository.update(
        { mobile },
        { isActive: false },
      );

      if (!isAllInActiveMobile || !isAllInActiveEmail) {
        const message = await i18n?.t('errors.auth.somethingWrong');
        throw new UnprocessableEntityException(message)
      }
      const savedResult = await this.userVerificationRepository.save(
        this.userVerificationRepository.create(data),
      );

      const isSuccess = sid
        ? i18n?.t('success.otp.otpSent')
        : i18n?.t('success.otp.otpSentEmail');

      return {
        status: HttpStatus.OK,
        message: isSuccess,
        result: savedResult,
      };
    } catch (error) {
      console.error('REGISTER OTP SERVICE ERROR', error);
      throw new UnprocessableEntityException(error?.message);
    }
  }

  async sendMobileOtpTransaction(
    otpSendDto: OtpSendDto & { type?: OtpTypes },
    userAgent: string,
    deviceId: string,
    userIp: string,
    shouldByPassRecaptcha: boolean = false,
  ): Promise<any> {
    try {
      const i18n = I18nContext.current();

      const { telephone, telephonePrefix, email, recaptchaToken } = otpSendDto;
      const mobile = `+${telephonePrefix}${telephone}`;

      if (!shouldByPassRecaptcha) {
        const resultRecaptcha = await this.validateRecaptcha(
          recaptchaToken,
          userAgent,
          userIp,
        );

        if (resultRecaptcha.code === 400) {
          const i18n = I18nContext.current();
          const message = await i18n?.t('errors.otp.recaptchaValidationFailed');
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              error: {
                msg: message,
              },
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
      }

      if (otpSendDto?.type !== OtpTypes.verify_transaction  && otpSendDto?.type !== OtpTypes.verify_account_deletion) {
        const isExist = await this.authService.emailExists({ email });
        if (isExist) {
          const message = await i18n?.t('errors.auth.emailExists');
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              error: {
                msg: message,
              },
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
      }
      const isExist2 = await this.authService.emailExists2({ email });
      const userId = isExist2?.id;
      const regulation = isExist2?.client?.regulations;
      const client = await this.userRepository.findOne({
        where:{email},
        relations :['client.regulation']
      })

      const sid = '';

      const generatedOtp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });

      await this.otpRepository.save(
        this.otpRepository.create({
          email,
          otp: generatedOtp,
          type: otpSendDto?.type ? otpSendDto?.type : OtpTypes.verify_email,
          isActive: true,
          expires: new Date(Date.now() + 15 * 60 * 1000),
        }),
      );
  try{
      await this.mailService.sendOtpViaEmail({
        to: email,
        data: {
          otp: generatedOtp,
          userId,
          regulation,
          regulationId: client?.client?.regulation?.id
        },
      });
    }
   catch (error) {
    console.error('sendOtpViaEmail failed', error);
    throw new InternalServerErrorException('Failed to send OTP via email.');
   }
      // const smsService: string =
      //   this.configService.get('twilio.service_sms', { infer: true }) || '';

      // const verification = await this.twilioService.client.verify.v2
      //   .services(smsService)
      //   .verifications.create({
      //     channel: 'sms',
      //     to: mobile,
      //   });

      // if (verification.status !== 'pending') {
      //   const message = `OTP sending failed with status: ${verification.status}`;
      //   throw new HttpException(
      //     {
      //       status: HttpStatus.INTERNAL_SERVER_ERROR,
      //       error: {
      //         msg: message,
      //       },
      //     },
      //     HttpStatus.INTERNAL_SERVER_ERROR,
      //   );
      // }
      // sid = verification.sid;

      const data = {
        email,
        mobile,
        sid: sid || 'Not applicable for email',
        deviceId,
        verificationType: sid ? 'email_mobile' : 'email',
        isMobileVerified: false,
        reason: otpSendDto?.type ? otpSendDto?.type : OtpTypes.verify_mobile,
        isEmailVerified: false,
        isActive: true,
        createdAt: now_ts(),
      };
      console.log('00000000000000', data);

      const isAllInActiveEmail = await this.userVerificationRepository.update(
        { email },
        { isActive: false },
      );

      const isAllInActiveMobile = await this.userVerificationRepository.update(
        { mobile },
        { isActive: false },
      );

      if (!isAllInActiveMobile || !isAllInActiveEmail) {
        const message = await i18n?.t('errors.auth.somethingWrong');
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: {
              msg: message,
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      const savedResult = await this.userVerificationRepository.save(
        this.userVerificationRepository.create(data),
      );
      const isSuccess = sid
        ? i18n?.t('success.otp.otpSent')
        : i18n?.t('success.otp.otpSentEmail');
      return {
        status: HttpStatus.OK,
        message: isSuccess,
        result: savedResult,
      };
    } catch (error) {
      console.error('TRANSACTION OTP SERVICE ERROR', error);
      throw new UnprocessableEntityException(error?.message);
    }
  }

  async verifyOtp(
    id: number,
    email: string,
    telephonePrefix: string,
    telephone: string,
    code: string,
    type?: OtpTypes,
  ): Promise<any> {
    const isExist = await this.authService.emailExists({ email });
    const i18n = I18nContext.current();
    if (type !== OtpTypes.verify_transaction) {
      const message = await i18n?.t('errors.auth.emailExists');
      if (isExist) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: {
              msg: message,
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
    const mobile = telephonePrefix && telephone ? `+${telephonePrefix}${telephone}` : '';
    const smsService: string =
      this.configService.get('twilio.service_sms', { infer: true }) || '';

    const userVerification = await this.userVerificationRepository.findOne({
      where: {
        id,
        email,
        mobile,
        isActive: true,
      },
    });

    if (!userVerification) {
      const message = i18n?.t('errors.auth.notFound');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    let result;

    const otpEmail = await this.otpRepository.findOne({
      where: { email, otp: code, isActive: true, isVerified: false },
    });

    if (!otpEmail) {
      const message = i18n?.t('errors.otp.invalidOtp');
      throw new BadRequestException(message);
      const verification_check = await this.twilioService.client.verify.v2
        .services(smsService)
        .verificationChecks.create({
          code,
          to: mobile,
        });

      console.log(verification_check.status, 'verification_check'); // log the status for debugging purposes

      if (verification_check.status !== 'approved') {
        const message = i18n?.t('errors.otp.invalidOtp');
        // This assumes 'approved' is the status returned by Twilio on successful verification.
        // You might want to adjust this according to the actual statuses returned by Twilio.
        console.log(verification_check, email, mobile, id, code);
        throw new BadRequestException(message);
      }

      result = await this.userVerificationRepository.save(
        this.userVerificationRepository.create({
          id,
          isMobileVerified: true,
          isActive: false,
        }),
      );

      const isSuccess = i18n?.t('success.otp.verifiedOtp');

      return {
        status: HttpStatus.OK,
        message: isSuccess,
        result,
      };
    }

    const dateNow = new Date();

    if (otpEmail.expires < dateNow) {
      const message = i18n?.t('errors.auth.otpExpired');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    result = await this.userVerificationRepository.save(
      this.userVerificationRepository.create({
        id,
        isEmailVerified: true,
        isActive: false,
      }),
    );

    await this.otpRepository.update(otpEmail.id, {
      isActive: false,
      isVerified: true,
      verifiedAt: new Date(),
    });

    const isSuccess = i18n?.t('success.otp.verifiedOtp');

    return {
      status: HttpStatus.OK,
      message: isSuccess,
      result: { ...result, otpId: otpEmail.id },
    };
  }

  async sendEmailOtp(otpDto: SendOtpEmailDTO): Promise<any> {
    const i18n = I18nContext.current();
    const existingUser = await this.userRepository.findOne({
      where: { email: otpDto.email, status: { id: 1 } },
    });
    if (existingUser && otpDto.type === 'verify_email') {
      const message = await i18n?.t('errors.auth.emailExists');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const isExist2 = await this.authService.emailExists2({
      email: otpDto.email,
    });
    const userId = isExist2?.id;
    const regulation = isExist2?.client?.regulations;

    const generatedOtp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await this.mailService.sendOtpViaEmail({
      to: otpDto.email,
      data: {
        otp: generatedOtp,
        userId,
        regulation,
      },
    });

    const otpResult = this.otpRepository.create({
      email: otpDto.email,
      otp: generatedOtp,
      type: otpDto.type,
      isActive: true,
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });

    await this.otpRepository.update(
      {
        email: otpDto.email,
      },
      { isActive: false },
    );

    await this.userVerificationRepository.update(
      {
        email: otpDto.email,
      },
      { isActive: false },
    );
    const mobile = `+${otpDto.telephonePrefix}${otpDto.telephone}`;
    await this.otpRepository.save(otpResult);
    const data = {
      email: otpDto.email,
      sid: 'not applicable for email',
      mobile,
      verificationType: 'email',
      isMobileVerified: false,
      isEmailVerified: false,
      isActive: true,
      reason: otpDto.type,
      createdAt: now_ts(),
    };

    const result = await this.userVerificationRepository.save(
      this.userVerificationRepository.create(data),
    );

    const isSuccess = i18n?.t('success.otp.emailOtpSend');

    return {
      status: HttpStatus.OK,
      message: isSuccess,
      result: result,
    };
  }

  async verifyEmailOtp(@Body() otpDto: VerifyOtpEmailDTO): Promise<any> {
    const i18n = I18nContext.current();
    const userVerification = await this.userVerificationRepository.findOne({
      where: { id: otpDto.id },
    });
    if (!userVerification) {
      const message = await i18n?.t('errors.auth.userVerificationRecord');
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: {
            msg: message,
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (userVerification.isEmailVerified === true) {
      const message = i18n?.t('errors.auth.emailVerified');
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: {
            msg: message,
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const otpEmail = await this.otpRepository.findOne({
      where: {
        email: otpDto.email,
        otp: otpDto.otp,
        isActive: true,
        isVerified: false,
      },
    });

    if (!otpEmail) {
      const message = i18n?.t('errors.auth.otpNotVerified');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const verification = this.userVerificationRepository.create({
      id: otpDto.id,
      isEmailVerified: true,
      isActive: false,
    });
    const result = await this.userVerificationRepository.save(verification);

    await this.otpRepository.update(otpEmail.id, {
      isActive: false,
      isVerified: true,
      verifiedAt: new Date(),
    });

    const isSuccess = i18n?.t('success.otp.emailOtpVerify');

    return {
      status: HttpStatus.OK,
      message: isSuccess,
      result: { ...result, otpId: otpEmail.id },
    };
  }

  async getNewsletterSubscriptionOTP(otpDto: { email: string }): Promise<Otp> {
    const generatedOtp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const otp = this.otpRepository.create({
      email: otpDto.email,
      otp: generatedOtp,
      type: OtpTypes.newsletter_subscription,
      isActive: true,
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });

    await this.otpRepository.update(
      {
        email: otpDto.email,
      },
      { isActive: false },
    );

    const otpResult = await this.otpRepository.save(otp);
    return otpResult;
  }

  async verifyNewsletterSubscriptionOTP(otpDto: {
    email: string;
    otp: string;
  }): Promise<boolean> {
    const otp = await this.otpRepository.findOne({
      where: {
        email: otpDto.email,
        otp: otpDto.otp,
        type: OtpTypes.newsletter_subscription,
        isActive: true,
        isVerified: false,
      },
    });
    if (!otp) {
      throw new BadRequestException('Otp Not Found');
    }

    const otpExpireTime = new Date(otp?.expires);

    if (otpExpireTime.getTime() <= Date.now()) {
      throw new BadRequestException('Otp Expired');
    }

    const isUpdated = await this.otpRepository.update(
      {
        email: otpDto.email,
        isActive: true,
      },
      {
        isActive: false,
        isVerified: true,
        verifiedAt: new Date(),
      },
    );
    return isUpdated?.affected ? isUpdated?.affected <= 1 : false;
  }

  async sendLoginOtp(
    otpDto: SendOtpLoginEmailDTO,
    deviceId: string,
    headers: any,
  ): Promise<any> {
    const i18n = I18nContext.current();
    if (!deviceId) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: 'Device id is missing',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const headerUrl = headers.origin;
    const allowedDomain = this.configService.getOrThrow('app.allowedDomains', {
      infer: true,
    });

    const domain = allowedDomain.find((d) => headerUrl.includes(d));

    if (!domain) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: 'Invalid Domain',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const thresholdTime =
      now_ts() -
      this.configService.getOrThrow('app.otpThreshold', { infer: true });
    const thresholdTimeForDevice =
      now_ts() -
      this.configService.getOrThrow('app.deviceIdOtpThreshold', {
        infer: true,
      });

    await this.userVerificationRepository.count({
      where: {
        createdAt: MoreThan(thresholdTime),
        verificationType: 'email',
      },
    });

    await this.userVerificationRepository.count({
      where: {
        createdAt: MoreThan(thresholdTimeForDevice),
        deviceId,
        verificationType: 'email',
      },
    });

    this.configService.getOrThrow('app.otpThresholdCount', {
      infer: true,
    });

    this.configService.getOrThrow('app.deviceIdOtpThresholdCount', {
      infer: true,
    });

    const existingUser = await this.userRepository.findOne({
      where: { email: otpDto.email, status: { id: 1 }, isOperator: false },
    });

    if (!existingUser && otpDto.type === 'verify_email') {
      const message = await i18n?.t('errors.auth.emailNotFound');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isValidPassword: boolean = bcrypt.compareSync(
      otpDto.password,
      existingUser?.password ?? '',
    );

    if (!isValidPassword) {
      const message = i18n?.t('errors.auth.passwordIncorrect');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isExist2 = await this.authService.emailExists2({
      email: otpDto.email,
    });
    const userId = isExist2?.id;
    const regulation = isExist2?.client?.regulations;
    const mobile = `+${isExist2?.telephonePrefix}${isExist2?.telephone}`;

    const generatedOtp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await this.mailService.sendOtpViaEmail({
      to: otpDto.email,
      data: {
        otp: generatedOtp,
        userId,
        regulation,
      },
    });

    const otpResult = this.otpRepository.create({
      email: otpDto.email,
      otp: generatedOtp,
      type: otpDto.type,
      isActive: true,
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });

    await this.otpRepository.update(
      {
        email: otpDto.email,
      },
      { isActive: false },
    );

    await this.userVerificationRepository.update(
      {
        email: otpDto.email,
      },
      { isActive: false },
    );
    await this.otpRepository.save(otpResult);
    const data = {
      email: otpDto.email,
      sid: 'not applicable for email',
      verificationType: 'email',
      mobile,
      isMobileVerified: false,
      isEmailVerified: false,
      isActive: true,
      reason: otpDto.type,
      createdAt: now_ts(),
    };

    const result = await this.userVerificationRepository.save(
      this.userVerificationRepository.create(data),
    );

    const isSuccess = i18n?.t('success.otp.emailOtpSend');

    return {
      status: HttpStatus.OK,
      message: isSuccess,
      result: result,
    };
  }

  async verifyLoginOtp({ email, id, code }: OtpVerifyLoginDto): Promise<any> {
    const isExist = await this.authService.emailExists({ email });

    const i18n = I18nContext.current();
    const message = await i18n?.t('errors.auth.emailNotFound');
    if (!isExist) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const isExist2 = await this.authService.emailExists2({
      email: email,
    });
    const mobile = `+${isExist2?.telephonePrefix}${isExist2?.telephone}`;

    const userVerification = await this.userVerificationRepository.findOne({
      where: {
        id,
        email,
        mobile,
        isActive: true,
      },
    });

    if (!userVerification) {
      const message = i18n?.t('errors.auth.notFound');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    let result;

    const otpEmail = await this.otpRepository.findOne({
      where: { email, otp: code, isActive: true, isVerified: false },
    });

    if (!otpEmail) {
      const message = i18n?.t('errors.otp.invalidOtp');
      throw new BadRequestException(message);
    }

    result = await this.userVerificationRepository.save(
      this.userVerificationRepository.create({
        id,
        isEmailVerified: true,
        isActive: false,
      }),
    );

    await this.otpRepository.update(otpEmail.id, {
      isActive: false,
      isVerified: true,
      verifiedAt: new Date(),
    });

    const isSuccess = i18n?.t('success.otp.verifiedOtp');

    return {
      status: HttpStatus.OK,
      message: isSuccess,
      result: { ...result, otpId: otpEmail.id },
    };
  }

  async isOTPisVerifiedinTimeSpan(verifyOTPDTO: {
    verificationId: number;
    email: string;
    type: OtpTypes;
  }): Promise<boolean> {
    const i18n = I18nContext.current();
    const otp = await this.otpRepository.findOne({
      where: {
        email: verifyOTPDTO.email,
        id: verifyOTPDTO.verificationId,
        type: verifyOTPDTO.type,
        isVerified: true,
      },
    });

    if (!otp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: {
            msg: i18n?.t('errors.auth.otpNotFound'),
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const otpVerifiedTime = otp.verifiedAt ? new Date(otp.verifiedAt) : null;
    if (!otpVerifiedTime) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: i18n?.t('errors.auth.otpNotVerified'),
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const currentTime = new Date()?.getTime();
    const timeLimit =
      Number(process.env.OTP_VERIFIED_TIME_LIMIT_IN_MINUTE || 1) * 60 * 1000; // 1.5 minutes in milliseconds
    const timeDifference = currentTime - otpVerifiedTime?.getTime();

    if (timeDifference > timeLimit) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: i18n?.t('errors.auth.otpExpired'),
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return true;
  }
}
