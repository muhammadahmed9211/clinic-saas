import {
  BadRequestException,
  ConflictException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import crypto from 'crypto';
import ms from 'ms';
import { I18nContext } from 'nestjs-i18n';
import { Communication } from 'src/admin/client/entities/communication.entity';
import {
  CustomStatus,
  StatusType,
} from 'src/admin/client/entities/custom_status.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { PartnerType } from 'src/admin/custom-dropdown/custom-dropdown/entities/partner-type.entity';
import {
  KycTemplateNames,
  KycTemplateSubject_AR,
  KycTemplateSubject_EN,
} from 'src/admin/kyc/dto/admin-kyc.dto';
import { AddAnswerDto } from 'src/admin/leads/dto/add-answer.dto';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import { LeadsService } from 'src/admin/leads/leads.service';
import { LeadsRepository } from 'src/admin/leads/repositories/lead.repository';
import { PartnerService } from 'src/admin/partner/partner.service';
import {
  CreateTaskDto,
  TaskPriorityLevel,
  TaskRelatedTo,
} from 'src/admin/task/dto/create-task.dto';
import { TaskEntityType } from 'src/admin/task/entities/task.entity';
import { TaskService } from 'src/admin/task/task.service';
import { BillingInformation } from 'src/billing-information/entities/billing-information.entity';
import { EventTypes } from 'src/common/services/event.type';
import { FilesService } from 'src/files/files.service';
import { MailerService } from 'src/mailer/mailer.service';
import { AccountService as Mt5AccountService } from 'src/mt5/account/account.service';
import { CreateAccountRequest } from 'src/mt5/account/dto/create-account.dto';
import {
  NotificationMessages,
  NotificationTitles,
} from 'src/notification/constants/notification.messages';
import { NotificationService } from 'src/notification/notification.service';
import { RoleService } from 'src/roles/role.service';
import { ActiveStatus, Partner } from 'src/settings/entities/partner.entity';
import { SettingsService } from 'src/settings/settings.service';
import { Label } from 'src/tasks/entities/label.entity';
import { MasterTaskService } from 'src/tasks/task.service';
import { UserKycDocumentsService } from 'src/user-kyc-docs/user-kyc-documents.service';
import { ClientsService } from 'src/users/clients.service';
import {
  AccountClassification,
  Client,
} from 'src/users/entities/client.entity';
import {
  ResetPassword,
  Status as ResetPasswordStatus,
} from 'src/users/entities/reset_password.entity';
import { UserAnswer } from 'src/users/entities/user_kyc_answers.entity';
import { UserVerification } from 'src/users/entities/user_verification.entity';
import { UserLifeCycle } from 'src/utils/enums/user-lifecycle.enum';
import { RandomPasswordService } from 'src/utils/random-password.service';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { ServerName } from 'src/wallet/entities/server.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { WalletService } from 'src/wallet/wallet.service';
import { DeepPartial, In, IsNull, MoreThan, Not, Repository } from 'typeorm';
import { AllConfigType } from '../config/config.type';
import { QuestionService } from '../kyc/question-answer.service';
import { MailService } from '../mail/mail.service';
import { Role } from '../roles/entities/role.entity';
import { RoleEnum } from '../roles/roles.enum';
import { Session } from '../session/entities/session.entity';
import { SessionService } from '../session/session.service';
import { SocialInterface } from '../social/interfaces/social.interface';
import { Status } from '../statuses/entities/status.entity';
import { StatusEnum } from '../statuses/statuses.enum';
import { LanguageType, User } from '../users/entities/user.entity';
import { NullableType } from '../utils/types/nullable.type';
import { AuthProvidersEnum } from './auth-providers.enum';
import { AuthChangePasswordDto } from './dto/auth-change-password.dto';
import { AuthEmailExistsDto } from './dto/auth-email-exists.dto';
import {
  AuthEmailLoginDto,
  AuthLoginLongTokenDto,
} from './dto/auth-email-login.dto';
import {
  AuthRegisterBrokerDto,
  AuthRegisterLoginDto,
  AuthRegisterQueryDto,
} from './dto/auth-register-login.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { NotificationsSettingsDto } from './dto/notifications-settings.dto';
import { StepsUpdateDto } from './dto/steps-update.dto';
import { UserAnswersDTO } from './dto/user-kyc-answers.dto';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import {
  LoginResponseType,
  SocialLoginResponseType,
} from './types/login-response.type';
import { LeadQuestionRepository } from 'src/admin/questions/repositories/question.repository';
import { LeadQuestion } from 'src/admin/questions/entities/question.entity';
import { partner_links } from 'src/admin/partner/entities/partner-links.entity';
import { WorldCheckService } from 'src/world-check/worldCheck.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Regulations } from 'src/admin/regulations/entities/regulations.entity';
import { Otp, OtpTypes } from 'src/users/entities/otp.entity';
import { OtpService } from 'src/otp/otp.service';
import { TaskLabel } from 'src/tasks/enum/task.enum';
import { RegulationsConfigService } from 'src/admin/regulations/regulations-config/regulations-config.service';
import { RegulationEventKeys } from 'src/admin/regulations/regulations-config/entities/regulation-event.entity';
import { RegulationRuleKeys } from 'src/admin/regulations/regulations-config/entities/regulation-rule.entity';
import { TransactionMethod } from 'src/transaction/entities/transaction-method.entity';
import { RegulationBlockedCountries } from 'src/admin/regulations/entities/regulation-blocked-countries.entity';
import { FeeType } from 'src/psp/dto/update-psp.dto';
import { ZoomParticipantDto } from './dto/auth-zapier-zoom-meeting.dto';
import { zapier_webhook_logs } from './entities/zapier-webhook-logs.entity';
import { LevelEnum } from 'src/roles/filter_level.enum';
import { Desk } from 'src/admin/custom-dropdown/custom-dropdown/entities/desk.entity';
import otpGenerator from 'otp-generator';
import { SendEmailService } from 'src/common/services/send-email.service';
import { ReferralProgramService } from 'src/referral-program/referral-program.service';
import { IbProfileService } from 'src/ib/ib_profile/ib_profile.service';
import { DeviceInfo } from 'src/push-notification/entities/device-info.entity';
import { RegulationsCountries } from 'src/admin/regulations/entities/regulations-countries.entity';
import { BankAccountService } from 'src/admin/bank-account/bank-account.service';
import { Currencies } from 'src/currencies/entities/currencies.entity';
import { Countries } from 'src/psp/entities/countries.entity';

interface ClientWithAllowMethods extends Client {
  allowedMethods?: TransactionMethod[];
}
interface UserWithWallet extends User {
  wallet?: Wallet;
  client: ClientWithAllowMethods;
}

type AllowMethods = TransactionMethod & {
  depositFeeValue: string;
  withdrawalFeeValue: string;
};
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private jwtService: JwtService,
    private sessionService: SessionService,
    private fileService: FilesService,
    private mailService: MailService,
    private mailerService: MailerService,
    private configService: ConfigService<AllConfigType>,
    private questionService: QuestionService,
    private clientsService: ClientsService,
    private worldCheckService: WorldCheckService,
    private readonly eventEmitter: EventEmitter2,
    private readonly masterTaskService: MasterTaskService,
    private readonly roleService: RoleService,
    private readonly notificationService: NotificationService,
    private readonly userKycDocumentsService: UserKycDocumentsService,
    private readonly regulationsConfigService: RegulationsConfigService,
    @InjectRepository(UserAnswer)
    private readonly userAnswerRepository: Repository<UserAnswer>,
    private readonly randomPasswordService: RandomPasswordService,
    private readonly walletService: WalletService,
    @InjectRepository(UserVerification)
    private readonly userVerificationRepository: Repository<UserVerification>,
    @InjectRepository(Communication)
    private communicationRepository: Repository<Communication>,
    @InjectRepository(CustomStatus)
    private customStatusRepository: Repository<CustomStatus>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ResetPassword)
    private readonly resetPasswordRepository: Repository<ResetPassword>,
    @InjectRepository(BillingInformation)
    private readonly billingInformationRepository: Repository<BillingInformation>,
    @InjectRepository(Operator)
    private readonly operatorRepository: Repository<Operator>,
    private readonly taskService: TaskService,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,
    @InjectRepository(PartnerType)
    private readonly partnerTypeRepository: Repository<PartnerType>,
    @InjectRepository(partner_links)
    private readonly partnerLinkRepository: Repository<partner_links>,
    @InjectRepository(Regulations)
    private readonly regulationsRepository: Repository<Regulations>,
    @InjectRepository(Desk)
    private readonly deskRepository: Repository<Desk>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(RegulationBlockedCountries)
    private readonly regulationBlockedCountriesRepository: Repository<RegulationBlockedCountries>,
    private readonly mt5AccountService: Mt5AccountService,
    private readonly partnerService: PartnerService,
    private readonly settingsService: SettingsService,
    private readonly leadRepository: LeadsRepository,
    private readonly leadService: LeadsService,
    private readonly leadQuestionRepository: LeadQuestionRepository,
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    @Inject(forwardRef(() => OtpService))
    private readonly otpService: OtpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(TransactionMethod)
    private readonly transactionMethodRepository: Repository<TransactionMethod>,
    @InjectRepository(zapier_webhook_logs)
    private readonly zapierWebhookRepository: Repository<zapier_webhook_logs>,
    @InjectRepository(RegulationsCountries)
    private readonly regulationsCountriesRepository: Repository<RegulationsCountries>,
    private readonly sendEmailService: SendEmailService,
    private readonly referralProgramService: ReferralProgramService,
    private readonly ibProfileService: IbProfileService,
    @InjectRepository(DeviceInfo)
    private readonly deviceInfoRepository: Repository<DeviceInfo>,
    private readonly bankAccountService : BankAccountService,
    @InjectRepository(Currencies)
    private readonly currenciesRepository: Repository<Currencies>,
    @InjectRepository(Countries)
    private readonly countriesRepository: Repository<Countries>
  ) {}

  async validateLogin(
    loginDto: AuthEmailLoginDto,
    req: any,
    deviceId?: string,
  ): Promise<LoginResponseType> {
    const i18n = I18nContext.current();
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (loginDto.isOperator) {
      const operator = await this.userRepository.findOne({
        where: { email: loginDto.email, isOperator: true },
      });

      if (!operator) {
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

      if (operator.operator.is_active === false) {
        const message = await i18n?.t('errors.operator.isNotActive');
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
        loginDto.password,
        operator.password,
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

      const session = await this.sessionService.create({
        user: operator,
      });

      // Check if operator has 2FA enabled (TOTP)
      const is2FAVerified = operator.totp ? true : false;

      const { token, tokenExpires } = await this.getTokensData({
        id: operator.id,
        role: operator.role,
        languageIso: operator.languageIso,
        sessionId: session.id,
        email: operator.email,
        is2FAVerified,
        operator: {
          id: operator.operator.id,
          firstName: operator.firstName || '',
          lastName: operator.lastName || '',
          email: operator.email || '',
          is2FAVerified,
          isFirstLogin: operator.operator.isFirstLogin || false,
        },
      });

      // this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
      //   action: 'RecordCreated',
      //   entity_id: operator.operator.id,
      //   entity_type: 'Operator',
      //   json_object: req,
      //   performer_id: operator.operator.id,
      //   performer_type: 'Operator',
      //   is_from_archive: 0,
      //   trigger_type: 'Default',
      // });

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: { IP: ip, deviceId: deviceId },
        oldData: null,
        entityId: operator.operator.id,
        entityType: 'Operator',
        performerId: operator.operator.id,
        performerType: 'Operator',
        field: 'Operator Login',
      });

      return {
        token,
        tokenExpires,
        user: operator,
      };
    }

    const user = await this.clientsService.findOne({
      email: loginDto.email,
      isOperator: false,
      isActive: true,
      status: {
        id: 1,
      },
    });

    if (!user) {
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

    if (user.isDeleted === true) {
      const message = await i18n?.t('errors.auth.userNotFoundDeleted');
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

    if (user.emailOtp && user.isEmailOtpDefault && !loginDto.isOperator) {
      const { otpId, email } = loginDto;
      if (!otpId) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: {
              msg: 'Verification id is required',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      await this.otpService.isOTPisVerifiedinTimeSpan({
        verificationId: otpId,
        email,
        type: OtpTypes.verify_email,
      });
    }

    // if (user.provider !== AuthProvidersEnum.email) {
    //   const message = await i18n?.t('errors.auth.loginProvider');
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.UNPROCESSABLE_ENTITY,
    //       error: {
    //         msg: `${message} ${user.provider}`,
    //       },
    //     },
    //     HttpStatus.UNPROCESSABLE_ENTITY,
    //   );
    // }

    const isValidPassword: boolean = bcrypt.compareSync(
      loginDto.password,
      user.password,
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

    if (user?.emailOtp && user.isEmailOtpDefault) {
      const userVerification = await this.userVerificationRepository.findOne({
        where: {
          id: loginDto?.verificationId,
          mobile: `+${user?.telephonePrefix}${user?.telephone}`,
          email: loginDto.email,
          reason: OtpTypes.verify_email,
        },
      });

      if (
        userVerification === null ||
        userVerification.id != loginDto?.verificationId ||
        (!userVerification.isMobileVerified &&
          !userVerification.isEmailVerified)
      ) {
        const message = await i18n?.t('errors.auth.otpEmailNumberNotVerified');
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

    const session = await this.sessionService.create({
      user,
      fcmToken: loginDto?.fcmToken ?? '',
    });

    // Check if user has 2FA enabled and verified
    const is2FAVerified =
      (user?.emailOtp && user.isEmailOtpDefault) ||
      (user?.totp && user.isTotpDefault) ||
      (user?.mobileOtp && user.isMobileOtpDefault);

    const { token, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
      languageIso: user.languageIso,
      sessionId: session.id,
      email: user.email,
      is2FAVerified,
    });

    let kycStatus;

    if (user.role && user.role.id > 1) {
      kycStatus = await this.customStatusRepository.findOne({
        where: { id: user?.client.kycStatus },
        select: {
          id: true,
          name: true,
        },
      });
    }

    if (req.headers['x-channel-id'] === '002') {
      if (deviceId) {
        const existingDevice = await this.deviceInfoRepository.findOne({
          where: { deviceId: deviceId },
          relations: ['user'],
        });

        if (existingDevice) {
          if (existingDevice.user?.id !== user.id) {
            const previousUsers: number[] = existingDevice.previousUsers
              ? JSON.parse(existingDevice.previousUsers)
              : [];

            const userId = existingDevice.user?.id;

            if (userId !== undefined && !previousUsers.includes(userId)) {
              previousUsers.push(userId);
            }

            existingDevice.previousUsers = JSON.stringify(previousUsers);
            existingDevice.user = user;
            existingDevice.isRegistered = true;
            existingDevice.fcmToken =
              loginDto?.fcmToken || existingDevice.fcmToken;
            await this.deviceInfoRepository.save(existingDevice);
            console.log('Update user on existing devices:', existingDevice);
          } else {
            existingDevice.fcmToken =
              loginDto?.fcmToken || existingDevice.fcmToken;
            await this.deviceInfoRepository.save(existingDevice);
            console.log(
              'device already registered for this user, only updating fcm token:',
              user.id,
            );
          }
        } else {
          console.log('existing device not found for device id:', deviceId);
        }
      } else {
        console.log('Device ID not provided in the request headers.');
      }
    }

    // this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
    //   action: 'RecordCreated',
    //   entity_id: user.id,
    //   entity_type: 'User',
    //   json_object: req,
    //   performer_id: user.id,
    //   performer_type: 'User',
    //   is_from_archive: 0,
    //   trigger_type: 'Default',
    // });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: { IP: ip, deviceId: deviceId },
      oldData: null,
      entityId: user.id,
      entityType: 'User',
      performerId: user.id,
      performerType: 'User',
      field: 'User Login',
    });

    const kycStatusName = kycStatus?.name;

    if (process.env.AUTH_LOGIN_OTP_ENABLE === 'true' && loginDto.otpId) {
      await this.otpRepository.update(loginDto.otpId, {
        isVerified: false,
        entityId: user.id?.toString(),
      });
    }

    return {
      token,
      tokenExpires,
      user,
      kycStatusName,
    };
  }

  async validateLongTokenLogin(
    loginDto: AuthLoginLongTokenDto,
    req: any,
    deviceId?: string,
  ): Promise<LoginResponseType> {
    const i18n = I18nContext.current();

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (loginDto.isOperator) {
      const operator = await this.userRepository.findOne({
        where: {
          email: loginDto.email,
          isOperator: true,
          isLongTokenEnabled: true,
        },
      });

      if (!operator) {
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

      if (operator.operator.is_active === false) {
        const message = await i18n?.t('errors.operator.isNotActive');
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
        loginDto.password,
        operator.password,
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

      const session = await this.sessionService.create({
        user: operator,
      });

      // Check if operator has 2FA enabled (TOTP)
      const is2FAVerified = operator.totp ? true : false;

      const { token, tokenExpires } = await this.getLongLiveTokensData({
        id: operator.id,
        role: operator.role,
        languageIso: operator.languageIso,
        sessionId: session.id,
        email: operator.email,
        is2FAVerified,
        operator: {
          id: operator.operator.id,
          firstName: operator.firstName || '',
          lastName: operator.lastName || '',
          email: operator.email || '',
          is2FAVerified,
          isFirstLogin: operator.operator.isFirstLogin || false,
        },
      });

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: { IP: ip, deviceId: deviceId },
        oldData: null,
        entityId: operator.operator.id,
        entityType: 'Operator',
        performerId: operator.operator.id,
        performerType: 'Operator',
        field: 'Operator Login',
      });

      return {
        token,
        tokenExpires,
        user: operator,
      };
    }

    const user = await this.clientsService.findOne({
      email: loginDto.email,
      isOperator: false,
      isActive: true,
      isLongTokenEnabled: true,
      status: {
        id: 1,
      },
    });

    if (!user) {
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

    if (user.isDeleted === true) {
      const message = await i18n?.t('errors.auth.userNotFoundDeleted');
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

    // if (user.emailOtp && user.isEmailOtpDefault && !loginDto.isOperator) {
    //   const { otpId, email } = loginDto;
    //   if (!otpId) {
    //     throw new HttpException(
    //       {
    //         status: HttpStatus.UNPROCESSABLE_ENTITY,
    //         error: {
    //           msg: 'Verification id is required',
    //         },
    //       },
    //       HttpStatus.UNPROCESSABLE_ENTITY,
    //     );
    //   }

    //   await this.otpService.isOTPisVerifiedinTimeSpan({
    //     verificationId: otpId,
    //     email,
    //     type: OtpTypes.verify_email,
    //   });
    // }

    if (user.provider !== AuthProvidersEnum.email) {
      const message = await i18n?.t('errors.auth.loginProvider');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: `${message} ${user.provider}`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isValidPassword: boolean = bcrypt.compareSync(
      loginDto.password,
      user.password,
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

    // if (user?.emailOtp && user.isEmailOtpDefault) {
    //   const userVerification = await this.userVerificationRepository.findOne({
    //     where: {
    //       id: loginDto?.verificationId,
    //       mobile: `+${user?.telephonePrefix}${user?.telephone}`,
    //       email: loginDto.email,
    //       reason: OtpTypes.verify_email,
    //     },
    //   });

    //   if (
    //     userVerification === null ||
    //     userVerification.id != loginDto?.verificationId ||
    //     (!userVerification.isMobileVerified &&
    //       !userVerification.isEmailVerified)
    //   ) {
    //     const message = await i18n?.t('errors.auth.otpEmailNumberNotVerified');
    //     throw new HttpException(
    //       {
    //         status: HttpStatus.UNPROCESSABLE_ENTITY,
    //         error: {
    //           msg: message,
    //         },
    //       },
    //       HttpStatus.UNPROCESSABLE_ENTITY,
    //     );
    //   }
    // }

    const session = await this.sessionService.create({
      user,
    });

    // Check if user has 2FA enabled
    const is2FAVerified =
      (user?.emailOtp && user.isEmailOtpDefault) ||
      (user?.totp && user.isTotpDefault) ||
      (user?.mobileOtp && user.isMobileOtpDefault);

    const { token, tokenExpires } = await this.getLongLiveTokensData({
      id: user.id,
      role: user.role,
      languageIso: user.languageIso,
      sessionId: session.id,
      email: user.email,
      is2FAVerified,
    });

    // let kycStatus;

    // if (user.role && user.role.id > 1) {
    //   kycStatus = await this.customStatusRepository.findOne({
    //     where: { id: user?.client.kycStatus },
    //     select: {
    //       id: true,
    //       name: true,
    //     },
    //   });
    // }

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: { IP: ip, deviceId: deviceId },
      oldData: null,
      entityId: user.id,
      entityType: 'User',
      performerId: user.id,
      performerType: 'User',
      field: 'User Login',
    });

    // const kycStatusName = kycStatus?.name;

    return {
      token,
      tokenExpires,
      user,
    };
  }

  async findUser(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async verifyAccessToken(accessToken: string) {
    try {
      const payload = this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
      });

      return payload;
    } catch (err) {
      return null;
    }
  }

  async sessionCheck(sessionId: number, userId: number) {
    return await this.sessionService.findOne({
      where: { id: sessionId, user: { id: userId } },
    });
  }

  async validateSocialLogin(
    authProvider: string,
    socialData: SocialInterface,
  ): Promise<LoginResponseType> {
    const i18n = I18nContext.current();
    try {
      let user: NullableType<User> = null;
      const socialEmail = socialData.email?.toLowerCase();
      let userByEmail: NullableType<User> = null;

      if (socialEmail) {
        userByEmail = await this.clientsService.findOne({
          email: socialEmail,
        });
      }

      if (socialData.id) {
        user = await this.clientsService.findOne({
          socialId: socialData.id,
          provider: authProvider,
        });
      }

      if (user) {
        if (socialEmail && !userByEmail) {
          user.email = socialEmail;
          await this.clientsService.update(user.id, {
            email: socialEmail,
          });
        }
      } else if (userByEmail) {
        user = userByEmail;
      } else {
        const role = plainToClass(Role, {
          id: RoleEnum.client,
        });
        const status = plainToClass(Status, {
          id: StatusEnum.active,
        });

        user = await this.clientsService.create({
          email: socialEmail ?? null,
          firstName: socialData.firstName ?? null,
          lastName: socialData.lastName ?? null,
          socialId: socialData.id,
          provider: authProvider,
          role,
          status,
        });

        user = await this.clientsService.findOne({
          id: user.id,
        });
      }

      if (!user) {
        const message = await i18n?.t('errors.auth.userNotFound');
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

      const session = await this.sessionService.create({
        user,
      });

      // Social login - check if user has 2FA enabled
      const is2FAVerified =
        (user?.emailOtp && user.isEmailOtpDefault) ||
        (user?.totp && user.isTotpDefault) ||
        (user?.mobileOtp && user.isMobileOtpDefault);

      const { token: jwtToken, tokenExpires } = await this.getTokensData({
        id: user.id,
        role: user.role,
        languageIso: user.languageIso,
        sessionId: session.id,
        email: user.email,
        is2FAVerified,
      });

      return {
        token: jwtToken,
        tokenExpires,
        user,
      };
    } catch (error) {
      const message = await i18n?.t('errors.auth.invalidCredentials');
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

  async validateSocialLoginOnly(
    authProvider: string,
    socialData: SocialInterface,
  ): Promise<SocialLoginResponseType> {
    const i18n = I18nContext.current();
    try {
      let user: NullableType<User> = null;
      const socialEmail = socialData.email?.toLowerCase();
      let userByEmail: NullableType<User> = null;

      if (socialEmail) {
        userByEmail = await this.clientsService.findOne({
          email: socialEmail,
          isOperator: false,
          isActive: true,
        });
      }

      if (socialData.id) {
        user = await this.clientsService.findOne({
          socialId: socialData.id,
          provider: authProvider,
          isOperator: false,
          isActive: true,
          status: {
            id: 1,
          },
        });
      }

      // If user found by social ID, use it
      if (user) {
        if (socialEmail && !userByEmail) {
          user.email = socialEmail;
          await this.clientsService.update(user.id, {
            email: socialEmail,
          });
        }
      } else if (userByEmail) {
        // If user found by email but not by social ID, link the social account
        user = userByEmail;
        await this.clientsService.update(user.id, {
          socialId: socialData.id,
          provider: authProvider,
        });
      } else {
        // User doesn't exist - throw error for login
        const message = await i18n?.t('errors.auth.userNotFound');
        throw new NotFoundException(
          message || 'User not found. Please sign up first.',
        );
      }

      if (!user) {
        const message = await i18n?.t('errors.auth.userNotFound');
        throw new NotFoundException(
          message || 'User not found. Please sign up first.',
        );
      }

      const session = await this.sessionService.create({
        user,
      });

      // Social login - check if user has 2FA enabled
      const is2FAVerified =
        (user?.emailOtp && user.isEmailOtpDefault) ||
        (user?.totp && user.isTotpDefault) ||
        (user?.mobileOtp && user.isMobileOtpDefault);

      const { token: jwtToken, tokenExpires } = await this.getTokensData({
        id: user.id,
        role: user.role,
        languageIso: user.languageIso,
        sessionId: session.id,
        email: user.email,
        is2FAVerified,
      });

      const isSuccess = await i18n?.t('success.auth.loginSuccess');

      return {
        message: isSuccess || 'User logged in successfully',
        data: {
          ...user,
          isFirstTimeNameChange: user.client?.isFirstTimeNameChange ?? null,
          typeIb: user.client?.typeIb ?? false,
        } as User & { isFirstTimeNameChange?: boolean | null, typeIb?: boolean | null; },
        token: jwtToken,
        tokenExpires,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const message = await i18n?.t('errors.auth.invalidCredentials');
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

  async validateSocialSignup(
    authProvider: string,
    socialData: SocialInterface,
    source: string,
    language: string,
    searchParams?: {
      type?: string;
      partner_uuid?: string;
      utmSource?: string;
      commissionProfileId?: number;
      p1?: string;
      p2?: string;
      p3?: string;
      p4?: string;
      p5?: string;
      p6?: string;
      pu?: boolean;
      utmMedium?: string;
      utmCampaign?: string;
      utmContent?: string;
      utmTerm?: string;
      campaignId?: string;
      partnerTypeId?: number;
    },
  ): Promise<SocialLoginResponseType> {
    const i18n = I18nContext.current();
    const languageIso = language === 'AR' ? 'AR' : 'EN';

    try {
      const socialEmail = socialData.email?.toLowerCase();
      let existingUser: NullableType<User> = null;

      // Check if user already exists by email
      if (socialEmail) {
        existingUser = await this.clientsService.findOne({
          email: socialEmail,
        });
      }

      // Check if user already exists by social ID
      if (socialData.id) {
        const userBySocialId = await this.clientsService.findOne({
          socialId: socialData.id,
          provider: authProvider,
        });
        if (userBySocialId) {
          existingUser = userBySocialId;
        }
      }

      // If user already exists, throw error
      if (existingUser) {
        const message = await i18n?.t('errors.auth.userAlreadyExists');
        throw new ConflictException(
          message || 'User already exists. Please login instead.',
        );
      }

      // User doesn't exist - register them with full registration process
      if (!socialEmail) {
        const message = await i18n?.t('errors.auth.emailRequired');
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: {
              msg: message || 'Email is required for registration',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      // Check if email already exists
      const isExist = await this.emailExists({
        email: socialEmail,
        userType: 2, // Default user type for social registration
      });

      const password = this.randomPasswordService.generatePassword(15);

      if (isExist) {
        const message = await i18n?.t('errors.auth.emailExists');
        const existingUserFound = await this.clientsService.findOne({
          email: socialEmail,
          isActive: true,
        });
        const existingClientId = await this.leadRepository.findOne({
          where: {
            clientID: existingUserFound?.id?.toString(),
            isActive: true,
          },
        });
        const isClientPortal = true;
        await this.leadService.createDuplicateLeadNote(
          {
            email: socialEmail,
            firstName: socialData.firstName || '',
            lastName: socialData.lastName || '',
          } as any,
          existingClientId?.id,
          isClientPortal,
          existingUserFound?.id,
        );
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

      const ticketUser = await this.userRepository.findOne({
        where: { email: socialEmail, isTicketUser: true },
      });

      const defaultRegulation = await this.regulationsRepository.findOne({
        where: {
          name: 'FSCA',
        },
      });

      let user: User;

      if (!ticketUser) {
        user = await this.clientsService.create({
          firstName: socialData.firstName || '',
          lastName: socialData.lastName || '',
          email: socialEmail,
          password: password,
          // countryIso: defaultCountryIso,
          languageIso: languageIso,
          language: languageIso === 'AR' ? 'Arabic' : 'English',
          demo: false,
          sc: source,
          userType: 2,
          isBroker: false,
          role: {
            id: RoleEnum.client,
          } as Role,
          status: {
            id: StatusEnum.active,
          } as Status,
          // country: bodyCountry,
          userLifeCycle: UserLifeCycle.REGISTERED,
          socialId: socialData.id,
          provider: authProvider,
        } as any);

        // Update user with telephone after creation
        if (user) {
          const updatedUser = await this.clientsService.findOne({
            id: user.id,
          });
          if (updatedUser) {
            user = updatedUser;
          }
        }
      } else {
        user = await this.clientsService.updateUser(ticketUser.id, {
          firstName: socialData.firstName || '',
          lastName: socialData.lastName || '',
          email: socialEmail,
          password: password,
          // telephone: defaultTelephone,
          // telephonePrefix: defaultTelephonePrefix,
          // countryIso: defaultCountryIso,
          languageIso: languageIso,
          language: languageIso === 'AR' ? 'Arabic' : 'English',
          demo: false,
          sc: source,
          userType: 2,
          isBroker: false,
          role: {
            id: RoleEnum.client,
          } as Role,
          status: {
            id: StatusEnum.active,
          } as Status,
          // country: bodyCountry,
          userLifeCycle: UserLifeCycle.REGISTERED,
          fullName: `${socialData.firstName || ''} ${
            socialData.lastName || ''
          }`,
          socialId: socialData.id,
          provider: authProvider,
        } as any);
      }

      if (!user) {
        const message = await i18n?.t('errors.auth.userCreationFailed');
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: {
              msg: message || 'Failed to create user',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      await this.jwtService.signAsync(
        {
          confirmEmailUserId: user.id,
        },
        {
          secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.confirmEmailExpires', {
            infer: true,
          }),
        },
      );

      const session = await this.sessionService.create({
        user,
      });

      let userName: string | undefined = undefined;
      let phone: string | undefined = undefined;
      if (user.firstName && user.lastName) {
        userName = `${user.firstName} ${user.lastName}`;
      }

      if (user.telephonePrefix && user.telephone) {
        phone = `+${user.telephonePrefix} ${user.telephone}`;
      }

      let countryInfo: Countries | null | undefined;
      if (user?.countryIso) {
        countryInfo = await this.countriesRepository.findOne({
          where: {
            iso: user?.countryIso
          }
        });
      }
      await this.billingInformationRepository.save(
        this.billingInformationRepository.create({
          name: userName,
          phone,
          user: { id: user.id },
          address: user.address || undefined,
          city: user.city || undefined,
          country: user?.countryIso || undefined,
          ...(countryInfo ? {countryInfo}: {})
        }),
      );

      // Registration - 2FA not verified yet
      const is2FAVerified = false;

      const { token, tokenExpires } = await this.getTokensData({
        id: user.id,
        role: user.role,
        languageIso: user.languageIso,
        sessionId: session.id,
        email: user.email,
        is2FAVerified,
      });

      const { id, firstName, lastName, email, role } = user;

      const userInfo = {
        id,
        firstName,
        lastName,
        email,
        role,
      };
      const wallet = await this.walletService.create('USD', userInfo.id);
      if (!wallet) {
        const message = await i18n?.t('errors.auth.walletNotCreated');
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

      let lead: NullableType<Lead> = null;
      let partnerLink: NullableType<partner_links> = null;

      if (user.email) {
        lead = await this.leadRepository.findOne({
          where: { email: user?.email },
        });

        const salesStatus = await this.customStatusRepository.findOne({
          where: { type: StatusType.Sales, name: 'New' },
        });
        const leadStatus = await this.customStatusRepository.findOne({
          where: { type: StatusType.LEADS, name: 'New' },
        });
        const kycStatus = await this.customStatusRepository.findOne({
          where: { type: 'kyc_status' as any, name: 'No KYC' },
        });

        let partnerType: NullableType<PartnerType> = null;
        // let partner;

        if (searchParams?.partnerTypeId) {
          partnerType = await this.partnerTypeRepository.findOne({
            where: { id: searchParams?.partnerTypeId },
          });
        }

        const finalUtmSource = searchParams?.utmSource || lead?.utmSource;

        if (lead) {
          const updatedLead = await this.leadRepository.save({
            ...lead,
            userLifeCycle: UserLifeCycle.REGISTERED,
            registeredCreatedTime: new Date(),
            clientID: user?.id?.toString(),
            title: `${socialData.firstName || ''} ${socialData.lastName || ''}`,
            // phoneNumber: `${defaultTelephonePrefix}${defaultTelephone}`,
            // telephone: defaultTelephone,
            // telephonePrefix: defaultTelephonePrefix,
            companyName: partnerType
              ? partnerType.title
              : 'Individual Client (IC)',
            type: partnerType ? partnerType.title : 'Individual Client (IC)',
            leadSource: lead.leadSource || source,
            source: lead.source || source,
            firstName: socialData.firstName || '',
            lastName: socialData.lastName || '',
            email: socialEmail,
            zipCode: user?.postalCode || lead.zipCode,
            streetAddress: user?.address || lead.streetAddress,
            // country: bodyCountry || lead.country,
            language: languageIso === 'AR' ? 'Arabic' : 'English',
            speakingLanguage: languageIso === 'AR' ? 'Arabic' : 'English',
            // countryIso: defaultCountryIso,
            creationTime: new Date(Date.now()),
            lastCommunication: new Date(Date.now()),
            lastUpdate: new Date(Date.now()),
            registrationDate: new Date(Date.now()),
            affId: searchParams?.partner_uuid || lead.affId,
            utmSource: finalUtmSource,
            salesStatusID: salesStatus?.id,
            leadStatusID: leadStatus?.id,
            regulations: defaultRegulation?.name || 'FSCA',
            regulation: { id: defaultRegulation?.id },
            kycStatus: kycStatus?.id,
            ...searchParams,
            utmMedium: searchParams?.utmMedium || lead.utmMedium,
            utmCampaign: searchParams?.utmCampaign || lead.utmCampaign,
            utmContent: searchParams?.utmContent || lead.utmContent,
            utmTerm: searchParams?.utmTerm || lead.utmTerm,
            campaignID: searchParams?.campaignId || lead.campaignID,
          });

          this.eventEmitter.emit(EventTypes.USER_LOG, {
            newData: updatedLead,
            oldData: lead,
            entityId: lead.id,
            entityType: 'Lead',
            performerId: user.id,
            performerType: 'User',
            field: 'Lead Updated',
          });
        } else {
          lead = await this.leadService.create(
            {
              ...searchParams,
              title: `${socialData.firstName || ''} ${
                socialData.lastName || ''
              }`,
              // phoneNumber: defaultTelephonePrefix + defaultTelephone,
              // telephone: defaultTelephone,
              // telephonePrefix: defaultTelephonePrefix,
              companyName: partnerType
                ? partnerType.title
                : 'Individual Client (IC)',
              type: partnerType ? partnerType.title : 'Individual Client (IC)',
              leadSource: source,
              firstName: socialData.firstName || '',
              lastName: socialData.lastName || '',
              email: socialEmail,
              zipCode: user?.postalCode || '',
              streetAddress: user?.address || '',
              clientID: user?.id?.toString(),
              // country: bodyCountry || '',
              language: languageIso === 'AR' ? 'Arabic' : 'English',
              speakingLanguage: languageIso === 'AR' ? 'Arabic' : 'English',
              userLifeCycle: UserLifeCycle.REGISTERED,
              registeredCreatedTime: new Date(),
              // countryIso: defaultCountryIso,
              creationTime: new Date(Date.now()),
              lastCommunication: new Date(Date.now()),
              lastUpdate: new Date(Date.now()),
              registrationDate: new Date(Date.now()),
              partner_uuid: searchParams?.partner_uuid,
              utmSource: finalUtmSource,
              salesStatusId: salesStatus?.id,
              leadStatusId: leadStatus?.id,
              regulations: defaultRegulation?.name || 'FSCA',
              regulationId: defaultRegulation?.id,
              kycStatus: kycStatus?.id,
              source: source,
            },
            undefined,
            false,
            true,
          );

          if (lead) {
            this.eventEmitter.emit(EventTypes.USER_LOG, {
              newData: lead,
              oldData: null,
              entityId: lead.id,
              entityType: 'Lead',
              performerId: user.id,
              performerType: 'User',
              field: 'Lead Created',
            });
          }
        }
      }

      let clientCreate: NullableType<Client> = null;
      const commissionProfileId = searchParams?.commissionProfileId
        ? searchParams?.commissionProfileId
        : undefined;
      const uuid = searchParams?.partner_uuid ? searchParams.partner_uuid : undefined;
      let commissionProfile =
        await this.ibProfileService.getCommissionProfileOfPartner(
          commissionProfileId,
          uuid,
        );
      if (!commissionProfile) {
        commissionProfile = await this.ibProfileService.getDefaultProfile();
      }

      if (lead) {
        const payload = {
          p1: searchParams?.p1 || '',
          p2: searchParams?.p2 || '',
          p3: searchParams?.p3 || '',
          p4: searchParams?.p4 || '',
          p5: searchParams?.p5 || '',
          p6: searchParams?.p6 || '',
          pu: searchParams?.pu || false,
          affId: lead.affId || uuid,
          source: lead?.source || source,
          // country: bodyCountry,
          languageIso: languageIso as LanguageType,
          language: languageIso === 'AR' ? 'Arabic' : 'English',
          // countryIso: defaultCountryIso,
          isBlockEmails: false,
          regulations: defaultRegulation?.name || 'FSCA',
          regulation: defaultRegulation?.id,
          ...(partnerLink
            ? { affiliateLinkId: (partnerLink as partner_links).id }
            : {}),
          // countryOfResidence: bodyCountry,
          isCopyTrading: false,
          accountClassification: AccountClassification.STANDARD,
          commissionProfile,
          utmSource: searchParams?.utmSource || lead?.utmSource,
          typeIb: searchParams?.type?.toLowerCase() === 'ib' ? true : false,
          utmMedium: searchParams?.utmMedium || '',
          utmCampaign: searchParams?.utmCampaign || '',
          utmContent: searchParams?.utmContent || '',
          utmTerm: searchParams?.utmTerm || '',
          campaignId: searchParams?.campaignId || '',
        };
        clientCreate = await this.clientsService.createClientInfo(
          user,
          payload,
          lead,
        );
      }

      if (!clientCreate?.isBlockEmails) {
        const systemOperator = await this.operatorRepository.findOne({
          where: { full_name: 'System' },
        });
        if (!systemOperator) {
          throw new BadRequestException('System operator not found');
        }

        await this.sendEmailService.sendEmailToClient({
          entityName: 'client',
          entityValue: user.id as any,
          createdForId: user.id,
          emailEventName: 'CLIENT_REGISTER',
          operatorId: systemOperator.id,
          externalVariables: { password },
        });
      }

      await this.mt5AccountService.createDemoAccount(
        {
          Server: ServerName.DEMO,
          Currency: 'USD',
        } as CreateAccountRequest,
        user,
      );

      const findOperator = await this.userRepository.findOne({
        where: { operator: { id: clientCreate?.salesRepId } },
        relations: ['operator'],
      });

      const link = `${process.env.CRM_FRONT_END_URL}/clients/${user.id}`;

      if (findOperator) {
        await this.mailService.sendTextViaEmail({
          to: findOperator.operator.email,
          data: {
            subject: 'New Client Register',
            text: `New Client Register with id: ${clientCreate?.userId} \n First Name: ${clientCreate?.firstName}\n Last Name: ${clientCreate?.lastName}\n email: ${clientCreate?.email}`,
            operatorId: findOperator.operator.id,
          },
        });

        const currentDate = new Date();

        await this.taskService.create(
          {
            subject: 'New Client Register',
            assignTo: findOperator.operator.id,
            relatedTo: TaskRelatedTo.LEAD,
            relatedToId: lead?.id,
            status: 'NOT STARTED',
            description:
              'New client has registered with email: ' + clientCreate?.email,
            dueDate: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000),
            priority: TaskPriorityLevel.HIGH,
            repeat: 'never',
            contact: lead?.id,
            reminder: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000),
            entity: TaskEntityType.LEAD,
            entityId: lead?.id.toString(),
          } as CreateTaskDto,
          {
            id: findOperator?.id,
          } as User,
        );

        const label = await this.labelRepository.findOne({
          where: {
            description: NotificationMessages.clientRegistration_message_admin,
          },
        });

        const labelTitle = await this.labelRepository.findOne({
          where: {
            description: NotificationTitles.clientRegistration_admin_title,
          },
        });

        const operatorUser = await this.userRepository.findOne({
          where: { operator: { id: clientCreate?.salesRepId } },
        });

        const operator = await this.operatorRepository.findOne({
          where: { full_name: 'System' },
        });

        const notificationData = {
          entity_id: user.id,
          entity_name: 'client',
          description_label_id: label?.id,
          title_label_id: labelTitle?.id,
          created_by: operator?.full_name,
          is_read: false,
          is_deleted: false,
          user_id: operatorUser?.id,
          creator_id: operator?.id,
          admin_description: `A new Client has Signed up and Assigned to you.\n
          Client Name: ${clientCreate?.firstName} ${clientCreate?.lastName}`,
          link,
        };

        await this.notificationService.createNotification({
          ...notificationData,
        });
      }

      // const checkFor: RegulationRuleKeys[] = [RegulationRuleKeys.on_kyc_approval];

      // const regulationConfig =
      //   await this.regulationsConfigService.isAllowedInRegulation(
      //     regulation.id,
      //     RegulationEventKeys.mt5_live_account_creation,
      //     checkFor,
      //   );

      // if (regulationConfig[0] === true) {
      const taskLabel = await this.labelRepository.findOne({
        where: {
          key: TaskLabel.clientregistration_contact_details,
        },
      });

      const findTask = await this.masterTaskService.findByName(
        TaskLabel.clientregistration_contact_details,
      );

      await this.masterTaskService.createUserTask({
        user: { id: user.id },
        label: { id: taskLabel?.id || 1 },
        task: { id: findTask?.id || 1 },
        isForced: findTask?.isForcedComplete || true,
        dateTime: new Date(),
        url: findTask?.masterUrl || '',
        isCompleted: false,
      });
      // }

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: clientCreate,
        oldData: null,
        entityId: user.id,
        entityType: 'User',
        performerId: user.id,
        performerType: 'User',
        field: 'Client Created',
      });

      const label = await this.labelRepository.findOne({
        where: { description: NotificationMessages.clientregistration_signup },
      });

      const labelTitle = await this.labelRepository.findOne({
        where: {
          description: NotificationTitles.clientregistration_signup_title,
        },
      });

      const operator = await this.operatorRepository.findOne({
        where: { full_name: 'System' },
      });

      const notificationData = {
        entity_id: user?.id,
        entity_name: 'clients',
        description_label_id: label?.id,
        title_label_id: labelTitle?.id,
        created_by: 'System',
        is_read: false,
        is_deleted: false,
        user_id: user?.id,
        creator_id: operator?.id,
      };

      await this.notificationService.createNotification({
        ...notificationData,
      });

      const isSuccess = i18n?.t('success.auth.userRegistered');

      return {
        message: isSuccess || 'User registered successfully',
        data: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isFirstTimeNameChange: clientCreate?.isFirstTimeNameChange || false,
          typeIb: clientCreate?.typeIb || false,
        } as User & { isFirstTimeNameChange?: boolean | null, typeIb?: boolean | null; }, 
        token,
        tokenExpires,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const message = await i18n?.t('errors.auth.signupFailed');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message || 'Signup failed',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async emailExists(dto: AuthEmailExistsDto): Promise<boolean> {
    const user = await this.clientsService.findOne({
      email: dto.email,
      isTicketUser: false,
    });

    return user ? true : false;
  }

  async findRegulationId(regulations: string): Promise<any> {
    return await this.clientsService.findRegulationId(regulations);
  }

  async emailExists2(dto: AuthEmailExistsDto): Promise<any> {
    const user = await this.clientsService.findOne({ email: dto.email });

    return user;
  }

  async brokerEmailExists(dto: AuthEmailExistsDto): Promise<boolean> {
    const user = await this.partnerRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    return user ? true : false;
  }

  async userKycAnswers(
    req: any,
    userAnswerDTO: UserAnswersDTO[],
  ): Promise<any> {
    const answers: any[] = [];
    const i18n = I18nContext.current();

    const totalQuestions = await this.questionService.getTotalQuestionsCount();
    const language = req.headers['x_custom_lang']?.toLowerCase() || 'en';
    let phoneNumberValue: string | null = null;
    let telephonePrefixValue: string | null = null;
    let addressValue: string | null = null;
    let cityValue: string | null = null;
    let stateValue: string | null = null;
    let postalCodeValue: string | null = null;
    let countryValue: string | null = null;
    let dobValue: string | null = null;

    for await (const answersDto of userAnswerDTO) {
      const question = await this.questionService.getQuestionById(
        answersDto.questionId,
      );

      let nationalityValue: string | null = null;

      if (answersDto.answerId) {
        const matchingAnswer = question.answers.find(
          (answer) => answer.id === answersDto.answerId,
        );
        if (!matchingAnswer) {
          const message = await i18n?.t('errors.auth.answerNotFound');
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

        if (question.name === 'nationality') {
          nationalityValue = matchingAnswer.text;
        } else if (question.name === 'country') {
          countryValue = matchingAnswer.text;
        } else if (question.name === 'phone') {
          phoneNumberValue = matchingAnswer.text;
        }
      } else if (answersDto.answerText && question.name === 'nationality') {
        nationalityValue = answersDto.answerText;
      } else if (answersDto.answerText && question.name === 'country') {
        countryValue = answersDto.answerText;
      } else if (answersDto.answerText && question.name === 'phone') {
        phoneNumberValue = answersDto.answerText;
      } else if (answersDto.answerText && question.name === 'address') {
        addressValue = answersDto.answerText;
      } else if (answersDto.answerText && question.name === 'city') {
        cityValue = answersDto.answerText;
      } else if (answersDto.answerText && question.name === 'state') {
        stateValue = answersDto.answerText;
      } else if (answersDto.answerText && question.name === 'postCode') {
        postalCodeValue = answersDto.answerText;
      } else if (answersDto.answerText && question.name === 'dob') {
        dobValue = answersDto.answerText;
      }

      const existingAnswer = await this.userAnswerRepository.findOne({
        where: {
          userId: req.user.id,
          questionId: answersDto.questionId,
        },
      });

      if (existingAnswer) {
        await this.userAnswerRepository.update(existingAnswer.id, {
          answerId: answersDto.answerId,
          answerText: answersDto.answerText,
          updatedAt: new Date(),
        });

        const updatedAnswer = await this.userAnswerRepository.findOne({
          where: { id: existingAnswer.id },
        });

        answers.push(updatedAnswer);
      } else {
        const userKycAnswer = this.userAnswerRepository.create({
          userId: req.user.id,
          questionId: answersDto.questionId,
          answerId: answersDto.answerId,
          answerText: answersDto.answerText,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const newAnswer = await this.userAnswerRepository.save(userKycAnswer);
        answers.push(newAnswer);
      }

      if (question.name === 'nationality' && nationalityValue) {
        await this.clientRepository.update(
          { userId: req.user.id },
          { nationality: nationalityValue },
        );
      }

      if (question.name === 'address' && addressValue) {
        await this.userRepository.update(
          { id: req.user.id },
          { address: addressValue },
        );
      }

      if (question.name === 'city' && cityValue) {
        await this.userRepository.update(
          { id: req.user.id },
          { city: cityValue },
        );

        await this.clientRepository.update(
          { userId: req.user.id },
          { city: cityValue },
        );

        await this.leadRepository.update(
          { clientID: req.user.id },
          { city: cityValue },
        );
      }

      if (question.name === 'state' && stateValue) {
        await this.userRepository.update(
          { id: req.user.id },
          { state: stateValue },
        );

        await this.clientRepository.update(
          { userId: req.user.id },
          { state: stateValue },
        );

        await this.leadRepository.update(
          { clientID: req.user.id },
          { state: stateValue },
        );
      }

      if (question.name === 'postCode' && postalCodeValue) {
        await this.userRepository.update(
          { id: req.user.id },
          { postalCode: postalCodeValue },
        );

        await this.clientRepository.update(
          { userId: req.user.id },
          { zip: postalCodeValue },
        );

        await this.leadRepository.update(
          { clientID: req.user.id },
          { zipCode: postalCodeValue },
        );
      }

      if (question.name === 'country' && countryValue) {
        const countries = this.settingsService.getCountriesIso(language);
        const isoIndex = countries.result.findIndex(
          (country) => country.printableName === countryValue,
        );

        if (isoIndex !== -1) {
          const countryCode = countries.result[isoIndex];
          const regulationCountry =
            await this.regulationsCountriesRepository.findOne({
              where: {
                countryCode: countryCode?.iso,
              },
              relations: ['regulation'],
            });

          if (!regulationCountry) {
            const message = await i18n?.t('errors.auth.countryBlocked');
            throw new HttpException(
              {
                status: HttpStatus.UNPROCESSABLE_ENTITY,
                error: { msg: message },
              },
              HttpStatus.UNPROCESSABLE_ENTITY,
            );
          }

          telephonePrefixValue = countryCode?.phonePrefix || '';
          let languageValue = language;
          if (language === 'ar') {
            languageValue = 'Arabic';
          } else {
            languageValue = 'English';
          }

          await this.userRepository.update(
            { id: req.user.id },
            {
              country: countryValue,
              countryIso: countryCode?.iso,
              languageIso: language,
              telephonePrefix: countryCode?.phonePrefix,
            },
          );

          await this.clientRepository.update(
            { userId: req.user.id },
            {
              country: countryValue,
              countryIso: countryCode?.iso,
              countryOfResidence: countryValue,
              telephonePrefix: countryCode?.phonePrefix,
              regulation: regulationCountry?.regulation,
              regulations: regulationCountry?.regulation?.name,
              language: languageValue,
              languageIso: language,
            },
          );

          await this.leadRepository.update(
            { clientID: req.user.id },
            {
              regulation: regulationCountry?.regulation,
              regulations: regulationCountry?.regulation?.name,
              country: countryValue,
              countryIso: countryCode?.iso,
              language: languageValue,
              speakingLanguage: languageValue,
              telephonePrefix: countryCode?.phonePrefix,
            },
          );
        }
      }

      if (question.name === 'dob' && dobValue) {
        await this.userRepository.update(
          { id: req.user.id },
          { dob: dobValue },
        );
        await this.clientRepository.update(
          { userId: req.user.id },
          { dateOfBirth: dobValue },
        );
        await this.leadRepository.update(
          { clientID: req.user.id },
          { dateOfBirth: dobValue },
        );
      }

      if (question.name === 'phone' && phoneNumberValue) {
        await this.userRepository.update(
          { id: req.user.id },
          {
            telephone: phoneNumberValue,
          },
        );

        await this.clientRepository.update(
          { userId: req.user.id },
          {
            telephone: phoneNumberValue,
          },
        );

        // await this.leadRepository.update(
        //   { clientID: req.user.id },
        //   {
        //     telephone: phoneNumberValue,
        //     phoneNumber: telephonePrefixValue ? `${telephonePrefixValue}${phoneNumberValue}` : phoneNumberValue,
        //   },
        // );
      }

      const totalAnswers = await this.userAnswerRepository.count({
        where: { userId: req.user.id },
      });
      // const kycScore = ((totalAnswers / totalQuestions) * 100).toFixed(2);

      const kycScore = Math.min(
        (totalAnswers / totalQuestions) * 100,
        100,
      ).toFixed(2);

      await this.updateClientKycScore(req.user.id, +kycScore);
    }

    await this.leadRepository.update(
      { clientID: req.user.id },
      {
        telephone: phoneNumberValue || '',
        phoneNumber: telephonePrefixValue
          ? `${telephonePrefixValue}${phoneNumberValue}`
          : phoneNumberValue || '',
      },
    );

    const billingData: DeepPartial<BillingInformation> = {
      country: countryValue || undefined,
      city: cityValue || undefined,
      address: addressValue || undefined,
      phone: phoneNumberValue || undefined,
      postalCode: postalCodeValue || undefined,
    };

    let countryInfo : Countries | null | undefined;
    if(billingData.country){
      countryInfo = await this.countriesRepository.findOne({
        where:{
          iso:billingData.country
        }
      });
      if(countryInfo){
        billingData.countryInfo = countryInfo;
      }
    }

    await this.billingInformationRepository.update(
      { user: { id: req.user.id } },
      billingData,
    );

    const isSuccess = i18n?.t('success.auth.userAnswerSaved');

    return {
      message: isSuccess,
      data: answers,
    };
  }

  async userKycAnswersOptimized(
    req: any,
    userAnswerDTO: UserAnswersDTO[],
  ): Promise<any> {
    const i18n = I18nContext.current();
    const language = req.headers['x_custom_lang']?.toLowerCase() || 'en';
    const userId = req.user.id;

    // Batch fetch all questions upfront
    const questionIds = userAnswerDTO.map((dto) => dto.questionId);
    const uniqueQuestionIds = [...new Set(questionIds)];
    const questions = await Promise.all(
      uniqueQuestionIds.map((id) => this.questionService.getQuestionById(id)),
    );
    const questionMap = new Map(questions.map((q) => [q.id, q]));

    // Batch fetch all existing answers upfront
    const existingAnswers = await this.userAnswerRepository.find({
      where: {
        userId,
        questionId: In(uniqueQuestionIds),
      },
    });
    const existingAnswerMap = new Map(
      existingAnswers.map((ans) => [ans.questionId, ans]),
    );

    // Initialize value holders
    let addressValue: string | null = null;
    let cityValue: string | null = null;
    let stateValue: string | null = null;
    let postalCodeValue: string | null = null;
    let countryValue: string | null = null;
    let dobValue: string | null = null;
    let nationalityValue: string | null = null;

    // Prepare batch operations
    const answersToCreate: Array<{ entity: any; index: number }> = [];
    const answersToUpdate: Array<{ id: number; data: any }> = [];
    const answers: any[] = [];

    // Collect all updates for batching
    const userUpdates: DeepPartial<any> = {};
    const clientUpdates: DeepPartial<any> = {};
    const leadUpdates: DeepPartial<any> = {};
    let regulationCountry: any = null;
    let countryCode: any = null;

    // Process all answers
    for (const answersDto of userAnswerDTO) {
      const question = questionMap.get(answersDto.questionId);
      if (!question) {
        continue;
      }

      let currentNationalityValue: string | null = null;

      // Extract answer value
      if (answersDto.answerId) {
        const matchingAnswer = question.answers.find(
          (answer) => answer.id === answersDto.answerId,
        );
        if (!matchingAnswer) {
          const message = await i18n?.t('errors.auth.answerNotFound');
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

        if (question.name === 'nationality') {
          currentNationalityValue = matchingAnswer.text;
          nationalityValue = matchingAnswer.text;
        } else if (question.name === 'country') {
          countryValue = matchingAnswer.text;
        }
      } else if (answersDto.answerText) {
        switch (question.name) {
          case 'nationality':
            currentNationalityValue = answersDto.answerText;
            nationalityValue = answersDto.answerText;
            break;
          case 'country':
            countryValue = answersDto.answerText;
            break;
          case 'address':
            addressValue = answersDto.answerText;
            break;
          case 'city':
            cityValue = answersDto.answerText;
            break;
          case 'state':
            stateValue = answersDto.answerText;
            break;
          case 'postCode':
            postalCodeValue = answersDto.answerText;
            break;
          case 'dob':
            dobValue = answersDto.answerText;
            break;
        }
      }

      // Handle answer save/update
      const existingAnswer = existingAnswerMap.get(answersDto.questionId);
      const now = new Date();

      if (existingAnswer) {
        answersToUpdate.push({
          id: existingAnswer.id,
          data: {
            answerId: answersDto.answerId,
            answerText: answersDto.answerText,
            updatedAt: now,
          },
        });
        // Construct updated answer object instead of fetching
        answers.push({
          ...existingAnswer,
          answerId: answersDto.answerId,
          answerText: answersDto.answerText,
          updatedAt: now,
        });
      } else {
        const newAnswer = this.userAnswerRepository.create({
          userId,
          questionId: answersDto.questionId,
          answerId: answersDto.answerId,
          answerText: answersDto.answerText,
          createdAt: now,
          updatedAt: now,
        });
        const answerIndex = answers.length;
        answersToCreate.push({ entity: newAnswer, index: answerIndex });
        answers.push(newAnswer);
      }

      // Collect updates based on question type
      if (question.name === 'nationality' && currentNationalityValue) {
        clientUpdates.nationality = currentNationalityValue;
      }

      if (question.name === 'address' && addressValue) {
        userUpdates.address = addressValue;
      }

      if (question.name === 'city' && cityValue) {
        userUpdates.city = cityValue;
        clientUpdates.city = cityValue;
        leadUpdates.city = cityValue;
      }

      if (question.name === 'state' && stateValue) {
        userUpdates.state = stateValue;
        clientUpdates.state = stateValue;
        leadUpdates.state = stateValue;
      }

      if (question.name === 'postCode' && postalCodeValue) {
        userUpdates.postalCode = postalCodeValue;
        clientUpdates.zip = postalCodeValue;
        leadUpdates.zipCode = postalCodeValue;
      }

      if (question.name === 'country' && countryValue) {
        const countries = this.settingsService.getCountriesIso(language);
        const isoIndex = countries.result.findIndex(
          (country) => country.printableName === countryValue,
        );

        if (isoIndex !== -1) {
          countryCode = countries.result[isoIndex];
          regulationCountry = await this.regulationsCountriesRepository.findOne(
            {
              where: {
                countryCode: countryCode?.iso,
              },
              relations: ['regulation'],
            },
          );

          if (!regulationCountry) {
            const message = await i18n?.t('errors.auth.countryBlocked');
            throw new HttpException(
              {
                status: HttpStatus.UNPROCESSABLE_ENTITY,
                error: { msg: message },
              },
              HttpStatus.UNPROCESSABLE_ENTITY,
            );
          }

          const languageValue = language === 'ar' ? 'Arabic' : 'English';

          userUpdates.country = countryValue;
          userUpdates.countryIso = countryCode?.iso;
          userUpdates.languageIso = language;
          userUpdates.telephonePrefix = countryCode?.phonePrefix;

          clientUpdates.country = countryValue;
          clientUpdates.countryIso = countryCode?.iso;
          clientUpdates.countryOfResidence = countryValue;
          clientUpdates.telephonePrefix = countryCode?.phonePrefix;
          clientUpdates.regulation = regulationCountry?.regulation;
          clientUpdates.regulations = regulationCountry?.regulation?.name;
          clientUpdates.language = languageValue;
          clientUpdates.languageIso = language;

          leadUpdates.regulation = regulationCountry?.regulation;
          leadUpdates.regulations = regulationCountry?.regulation?.name;
          leadUpdates.country = countryValue;
          leadUpdates.countryIso = countryCode?.iso;
          leadUpdates.language = languageValue;
          leadUpdates.speakingLanguage = languageValue;
          leadUpdates.telephonePrefix = countryCode?.phonePrefix;
        }
      }

      if (question.name === 'dob' && dobValue) {
        userUpdates.dob = dobValue;
        clientUpdates.dateOfBirth = dobValue;
        leadUpdates.dateOfBirth = dobValue;
      }
    }

    // Execute batch operations
    const batchOperations: Promise<any>[] = [];

    // Batch create answers
    if (answersToCreate.length > 0) {
      batchOperations.push(
        this.userAnswerRepository
          .save(answersToCreate.map((item) => item.entity))
          .then((saved) => {
            // Update answers array with saved entities
            saved.forEach((savedAnswer, index) => {
              const originalIndex = answersToCreate[index].index;
              answers[originalIndex] = savedAnswer;
            });
          }),
      );
    }

    // Batch update answers
    if (answersToUpdate.length > 0) {
      batchOperations.push(
        Promise.all(
          answersToUpdate.map(({ id, data }) =>
            this.userAnswerRepository.update(id, data),
          ),
        ),
      );
    }

    // Batch update repositories
    if (Object.keys(userUpdates).length > 0) {
      batchOperations.push(
        this.userRepository.update({ id: userId }, userUpdates),
      );
    }

    if (Object.keys(clientUpdates).length > 0) {
      batchOperations.push(
        this.clientRepository.update({ userId }, clientUpdates),
      );
    }

    if (Object.keys(leadUpdates).length > 0) {
      batchOperations.push(
        this.leadRepository.update({ clientID: userId }, leadUpdates),
      );
    }

    // Update billing information
    const billingData: DeepPartial<BillingInformation> = {};
    
    if (countryCode?.iso) {
      billingData.country = countryCode.iso;
    }
    
    if (cityValue) {
      billingData.city = cityValue;
    }
    
    if (addressValue) {
      billingData.address = addressValue;
    }
    
    if (postalCodeValue) {
      billingData.postalCode = postalCodeValue;
    }

    let countryInfo : Countries | null | undefined;
    if(billingData.country){
      countryInfo = await this.countriesRepository.findOne({
        where:{
          iso:billingData.country
        }
      });
      if(countryInfo){
        billingData.countryInfo = countryInfo;
      }
    }

    if (Object.keys(billingData).length > 0) {
      batchOperations.push(
        this.billingInformationRepository.update(
          { user: { id: userId } },
          billingData,
        ),
      );
    }

    // Execute all batch operations in parallel
    await Promise.all(batchOperations);

    // Calculate KYC score once at the end
    const totalQuestions = await this.questionService.getTotalQuestionsCount();
    const totalAnswers = await this.userAnswerRepository.count({
      where: { userId },
    });

    const kycScore = Math.min(
      (totalAnswers / totalQuestions) * 100,
      100,
    ).toFixed(2);

    await this.updateClientKycScore(userId, +kycScore);

    const isSuccess = i18n?.t('success.auth.userAnswerSaved');

    return {
      message: isSuccess,
      data: answers,
    };
  }

  async updateClientKycScore(userId: string, kycScore: number): Promise<void> {
    await this.clientRepository.update(userId, { kycScore });
  }

  async getUserKycAnswersById(req: any): Promise<any> {
    const i18n = I18nContext.current();
    try {
      const userId = req.user.id;
      const userAnswers = await this.userAnswerRepository.find({
        where: { userId },
      });
      if (!userAnswers || userAnswers.length === 0) {
        const message = i18n?.t('errors.auth.userAnswersNotFound');
        return {
          message: message,
          data: [],
        };
      }

      const isSuccess = i18n?.t('success.auth.userAnswersRetrieved');

      const response = {
        message: isSuccess,
        data: userAnswers.map((userAnswer) => ({
          id: userAnswer.id,
          userId: userAnswer.userId,
          questionId: userAnswer.questionId,
          answerId: userAnswer.answerId,
          answerText: userAnswer.answerText,
        })),
      };

      return response;
    } catch (error) {
      const message = i18n?.t('errors.auth.userAnswersRetrievedError');
      return {
        message: message,
        data: null,
      };
    }
  }

  async register(
    registerDto: AuthRegisterLoginDto,
    verificationKey?: AuthRegisterQueryDto,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const { refCode = null, refUuid = null, ...dto } = registerDto;
    const isExist = await this.emailExists({
      email: dto.email,
      userType: dto.userType,
    });

    if (isExist) {
      const message = await i18n?.t('errors.auth.emailExists');

      const existingUser = await this.clientsService.findOne({
        email: dto.email,
        isActive: true,
      });
      const existingClientId = await this.leadRepository.findOne({
        where: { clientID: existingUser?.id?.toString(), isActive: true },
      });
      const isClientPortal = true;
      await this.leadService.createDuplicateLeadNote(
        dto,
        existingClientId?.id,
        isClientPortal,
        existingUser?.id,
      );
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

    let regulation: Regulations | null = null;

    if (dto.regulations) {
      regulation = await this.regulationsRepository.findOne({
        where: {
          name: dto.regulations,
        },
        // relations: ['blockedCountries', 'group', 'group.config'],
        relations: ['blockedCountries'],
      });
    } else {
      regulation = await this.regulationsRepository.findOne({
        where: {
          name: 'FSCA',
        },
        relations: ['blockedCountries'],
      });
    }

    if (!regulation) {
      const message = await i18n?.t('errors.auth.regulationNotFound');
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

    const blockedCountry =
      await this.regulationBlockedCountriesRepository.findOne({
        where: {
          regulation: { id: regulation.id },
          country: { countryCode: dto.countryIso },
        },
      });

    if (blockedCountry && dto.countryIso) {
      const message = await i18n?.t('errors.auth.countryBlocked');
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

    const password = this.randomPasswordService.generatePassword(15);
    // const password = 'Test@123';
    const userVerification = await this.userVerificationRepository.findOne({
      where: {
        id: dto.verificationId,
        mobile:
          dto.telephone && dto.telephonePrefix
            ? `+${dto.telephonePrefix}${dto.telephone}`
            : '',
        email: dto.email,
      },
    });

    const verificationBypass = this.configService.getOrThrow(
      'app.bypassOtpVerification',
      { infer: true },
    );

    if (verificationBypass != verificationKey?.key) {
      if (userVerification === null || !userVerification.isEmailVerified) {
        const message = await i18n?.t('errors.auth.otpEmailNumberNotVerified');
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

    let bodyCountry = dto.country;

    if (!bodyCountry) {
      const countries = this.settingsService.getCountriesIso();
      const isoIndex = countries.result.findIndex(
        (country) => country.iso === dto.countryIso,
      );
      bodyCountry = countries.result[isoIndex]?.printableName || '';
    }

    let partnerType: NullableType<PartnerType> = null;
    // let partner;

    if (dto.partnerTypeId) {
      partnerType = await this.partnerTypeRepository.findOne({
        where: { id: dto.partnerTypeId },
      });

      //   const createPartnerPayload: AuthRegisterBrokerDto = {
      //     firstName: dto.firstName,
      //     lastName: dto.lastName,
      //     email: dto.email,
      //     telephone: dto.telephone,
      //     telephonePrefix: dto.telephonePrefix,
      //     verificationId: dto.verificationId,
      //     countryIso: dto.countryIso,
      //     languageIso: dto.languageIso,
      //     partnerTypeId: dto.partnerTypeId,
      //     status: ActiveStatus.ACTIVE,
      //     password: password,
      //     title: `${dto.firstName} ${dto.lastName}`,
      //     contactName: `${dto.firstName} ${dto.lastName}`,
      //   };

      //   partner = await this.clientsService.createBroker(createPartnerPayload);
    }

    let user: User;

    const ticketUser = await this.userRepository.findOne({
      where: { email: dto.email, isTicketUser: true },
    });

    if (!ticketUser) {
      user = await this.clientsService.create({
        ...dto,
        email: dto.email,
        password: password,
        role: {
          id: RoleEnum.client,
        } as Role,
        status: {
          id: StatusEnum.active,
        } as Status,
        country: bodyCountry,
        userLifeCycle: UserLifeCycle.REGISTERED,
      });
    } else {
      user = await this.clientsService.updateUser(ticketUser.id, {
        ...dto,
        email: dto.email,
        password: password,
        role: {
          id: RoleEnum.client,
        } as Role,
        status: {
          id: StatusEnum.active,
        } as Status,
        country: bodyCountry,
        userLifeCycle: UserLifeCycle.REGISTERED,
        fullName: `${dto.firstName} ${dto.lastName}`,
      });
    }

    // if (partnerType && partner) {
    //   await this.userRepository.save({
    //     ...user,
    //     isPartner: true,
    //     partnerId: partner.id,
    //   });
    // }

    await this.jwtService.signAsync(
      {
        confirmEmailUserId: user.id,
      },
      {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('auth.confirmEmailExpires', {
          infer: true,
        }),
      },
    );

    const session = await this.sessionService.create({
      user,
    });
    let userName: string | undefined = undefined;
    let phone: string | undefined = undefined;
    if (user.firstName && user.lastName) {
      userName = `${user.firstName} ${user.lastName}`;
    }

    if (user.telephonePrefix && user.telephone) {
      phone = `+${user.telephonePrefix} ${user.telephone}`;
    }

    let countryInfo : Countries | null | undefined;
    if(user?.countryIso){
      countryInfo = await this.countriesRepository.findOne({
        where:{
          iso:user?.countryIso
        }
      });
    }
    await this.billingInformationRepository.save(
      this.billingInformationRepository.create({
        name: userName,
        phone,
        user: { id: user.id },
        address: user.address || undefined,
        city: user.city || undefined,
        country: user?.countryIso || undefined,
        ...(countryInfo ? {countryInfo} : {})
      }),
    );

    // Registration - 2FA not verified yet
    const is2FAVerified = false;

    const { token, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
      languageIso: user.languageIso,
      sessionId: session.id,
      email: user.email,
      is2FAVerified,
    });

    const { id, firstName, lastName, email, role } = user;

    const userInfo = {
      id,
      firstName,
      lastName,
      email,
      role,
    };
    const wallet = await this.walletService.create('USD', userInfo.id);
    if (!wallet) {
      const message = await i18n?.t('errors.auth.walletNotCreated');
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

    let lead: NullableType<Lead> = null;
    let partnerLink: NullableType<partner_links> = null;

    if (user.email) {
      lead = await this.leadRepository.findOne({
        where: { email: user?.email },
      });

      const salesStatus = await this.customStatusRepository.findOne({
        where: { type: StatusType.Sales, name: 'New' },
      });
      const leadStatus = await this.customStatusRepository.findOne({
        where: { type: StatusType.LEADS, name: 'New' },
      });
      const kycStatus = await this.customStatusRepository.findOne({
        where: { type: 'kyc_status' as any, name: 'No KYC' },
      });

      if (dto.partner_uuid && dto.affiliateLinkUrl) {
        const partner = await this.partnerRepository.findOne({
          where: { uuid: dto.partner_uuid },
        });
        if (partner?.status === ActiveStatus.ACTIVE) {
          partnerLink = await this.partnerLinkRepository.findOne({
            where: { url: dto.affiliateLinkUrl },
          });
        }

        if (partner?.status === ActiveStatus.INACTIVE) {
          dto.partner_uuid = '';
        }
      }
      if (lead) {
        const updatedLead = await this.leadRepository.save({
          ...lead,
          userLifeCycle: UserLifeCycle.REGISTERED,
          registeredCreatedTime: new Date(),
          clientID: user?.id?.toString(),
          title: `${dto?.firstName} ${dto?.lastName}`,
          phoneNumber: `${dto.telephonePrefix}${dto.telephone}`,
          telephone: dto.telephone,
          telephonePrefix: dto.telephonePrefix,
          companyName: partnerType
            ? partnerType.title
            : 'Individual Client (IC)',
          type: partnerType ? partnerType.title : 'Individual Client (IC)',
          leadSource: lead.leadSource || dto.sc,
          source: lead.source || dto.sc,
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          zipCode: user?.postalCode || lead.zipCode,
          streetAddress: user?.address || lead.streetAddress,
          utmCampaign: lead.utmCampaign || dto.utmCampaign,
          campaignId: lead.campaignID || dto.campaignId,
          utmContent: lead.utmContent || dto.utmContent,
          utmMedium: lead.utmMedium || dto.utmMedium,
          utmTerm: lead.utmTerm || dto.utmTerm,
          country: bodyCountry || lead.country,
          language: dto.language,
          languageIso: dto.languageIso,
          countryIso: dto.countryIso,
          creationTime: new Date(Date.now()),
          lastCommunication: new Date(Date.now()),
          lastUpdate: new Date(Date.now()),
          registrationDate: new Date(Date.now()),
          partner_uuid: dto.partner_uuid,
          p1: dto.p1,
          p2: dto.p2,
          p3: dto.p3,
          p4: dto.p4,
          p5: dto.p5,
          p6: dto.p6,
          pu: dto.pu,
          utmSource: lead.utmSource || dto.utmSource,
          campaignQuestions: dto.campaignQuestions,
          salesStatusID: salesStatus?.id,
          leadStatusID: leadStatus?.id,
          regulations: dto.regulations ? dto.regulations : 'FSCA',
          regulation: { id: regulation.id },
          kycStatus: kycStatus?.id,
        });

        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: updatedLead,
          oldData: lead,
          entityId: lead.id,
          entityType: 'Lead',
          performerId: user.id,
          performerType: 'User',
          field: 'Lead Updated',
        });
      } else {
        lead = await this.leadService.create(
          {
            title: `${dto?.firstName} ${dto?.lastName}`,
            phoneNumber:
              dto.telephonePrefix && dto.telephone
                ? dto.telephonePrefix + dto.telephone
                : '',
            telephone: dto.telephone,
            telephonePrefix: dto.telephonePrefix,
            companyName: partnerType
              ? partnerType.title
              : 'Individual Client (IC)',
            type: partnerType ? partnerType.title : 'Individual Client (IC)',
            leadSource: dto.sc,
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            zipCode: user?.postalCode || '',
            streetAddress: user?.address || '',
            clientID: user?.id?.toString(),
            utmCampaign: dto.utmCampaign || '',
            utmContent: dto.utmContent || '',
            utmMedium: dto.utmMedium || '',
            utmTerm: dto.utmTerm || '',
            campaignID: dto.campaignId || '',
            country: bodyCountry || '',
            languageIso: dto.languageIso,
            language: dto.language,
            userLifeCycle: UserLifeCycle.REGISTERED,
            registeredCreatedTime: new Date(),
            countryIso: dto.countryIso,
            creationTime: new Date(Date.now()),
            lastCommunication: new Date(Date.now()),
            lastUpdate: new Date(Date.now()),
            registrationDate: new Date(Date.now()),
            partner_uuid: dto.partner_uuid,
            p1: dto.p1,
            p2: dto.p2,
            p3: dto.p3,
            p4: dto.p4,
            p5: dto.p5,
            p6: dto.p6,
            pu: dto.pu,
            utmSource: dto.utmSource,
            campaignQuestions: dto.campaignQuestions,
            salesStatusId: salesStatus?.id,
            leadStatusId: leadStatus?.id,
            regulations: dto.regulations ? dto.regulations : 'FSCA',
            regulationId: regulation.id,
            kycStatus: kycStatus?.id,
            source: dto.sc || 'Client',
          },
          undefined,
          false,
        );

        if (lead) {
          this.eventEmitter.emit(EventTypes.USER_LOG, {
            newData: lead,
            oldData: null,
            entityId: lead.id,
            entityType: 'Lead',
            performerId: user.id,
            performerType: 'User',
            field: 'Lead Created',
          });
        }
      }
    }

    let clientCreate: NullableType<Client> = null;
    const commissionProfileId = dto.commissionProfileId
      ? dto.commissionProfileId
      : undefined;
    const uuid = dto.partner_uuid ? dto.partner_uuid : undefined;
    let commissionProfile =
      await this.ibProfileService.getCommissionProfileOfPartner(
        commissionProfileId,
        uuid,
      );
    if (!commissionProfile) {
      commissionProfile = await this.ibProfileService.getDefaultProfile();
    }

    if (lead) {
      const partnerLinkFromAbove = partnerLink as partner_links;
      const payload = {
        affId: dto.partner_uuid,
        source: lead?.source || 'Client',
        country: bodyCountry,
        p1: dto.p1,
        p2: dto.p2,
        p3: dto.p3,
        p4: dto.p4,
        p5: dto.p5,
        p6: dto.p6,
        pu: dto.pu,
        utmCampaign: lead.utmCampaign || dto.utmCampaign,
        utmContent: lead.utmContent || dto.utmContent,
        utmMedium: lead.utmMedium || dto.utmMedium,
        utmSource: lead.utmSource || dto.utmSource,
        campaignQuestions: dto.campaignQuestions,
        campaignId: lead.campaignID || dto.campaignId,
        utmTerm: lead.utmTerm || dto.utmTerm,
        languageIso: dto.languageIso as any,
        countryIso: dto.countryIso,
        isBlockEmails: dto.isBlockEmails,
        regulations: dto.regulations,
        regulation: regulation.id,
        ...(partnerLinkFromAbove
          ? { affiliateLinkId: partnerLinkFromAbove.id }
          : {}),
        countryOfResidence: bodyCountry,
        isCopyTrading: dto.isCopyTrading || false,
        commissionProfile,
        accountClassification:
          dto.classification || AccountClassification.STANDARD,
        isFirstTimeNameChange: true,
        isPhoneCountryChanged: dto?.isPhoneCountryChanged,
        typeIb: true,
      };
      clientCreate = await this.clientsService.createClientInfo(
        user,
        payload,
        lead,
      );
    }

    if (!clientCreate?.isBlockEmails) {
      const systemOperator = await this.operatorRepository.findOne({
        where: { full_name: 'System' },
      });
      if (!systemOperator) {
        throw new BadRequestException('System operator not found');
      }
      // const client = await this.clientRepository.findOne({
      //   where: { userId: user.id },
      //   relations: {
      //     regulation: true,
      //   },
      // });
      // const regulation = client?.regulations;
      // const regulationId = client?.regulation?.id;
      // console.log('regulationId: ', regulationId);
      await this.sendEmailService.sendEmailToClient({
        entityName: 'client',
        entityValue: user.id as any,
        createdForId: user.id,
        emailEventName: 'CLIENT_REGISTER',
        operatorId: systemOperator.id,
        externalVariables: { password },
      });
      // await this.mailService.sendWelcomeEmails({
      //   to: dto.email,
      //   context: {
      //     firstName: user?.firstName ?? '',
      //     userName: user?.email ?? '',
      //     password: password,
      //     accessLink: `${this.configService.getOrThrow('app.frontendDomain', {
      //       infer: true,
      //     })}/login`sad,
      //   },
      //   userId: user?.id,
      //   regulation,
      //   regulationId,
      // });
    }

    // if (user.demo) {
    await this.mt5AccountService.createDemoAccount(
      {
        Server: ServerName.DEMO,
        Currency: 'USD',
      } as CreateAccountRequest,
      user,
    );
    // }

    const findOperator = await this.userRepository.findOne({
      where: { operator: { id: clientCreate?.salesRepId } },
      relations: ['operator'],
    });

    const link = `${process.env.CRM_FRONT_END_URL}/clients/${user.id}`;

    if (findOperator) {
      await this.mailService.sendTextViaEmail({
        to: findOperator.operator.email,
        data: {
          subject: 'New Client Register',
          text: `New Client Register with id: ${clientCreate?.userId} \n First Name: ${clientCreate?.firstName}\n Last Name: ${clientCreate?.lastName}\n email: ${clientCreate?.email}`,
          operatorId: findOperator.operator.id,
        },
      });

      const currentDate = new Date();

      await this.taskService.create(
        {
          subject: 'New Client Register',
          assignTo: findOperator.operator.id,
          relatedTo: TaskRelatedTo.LEAD,
          relatedToId: lead?.id,
          status: 'NOT STARTED',
          description:
            'New client has registered with email: ' + clientCreate?.email,
          dueDate: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000),
          priority: TaskPriorityLevel.HIGH,
          repeat: 'never',
          contact: lead?.id,
          reminder: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000),
          entity: TaskEntityType.LEAD,
          entityId: lead?.id.toString(),
        } as CreateTaskDto,
        {
          id: findOperator?.id,
        } as User,
      );

      const label = await this.labelRepository.findOne({
        where: {
          description: NotificationMessages.clientRegistration_message_admin,
        },
      });

      const labelTitle = await this.labelRepository.findOne({
        where: {
          description: NotificationTitles.clientRegistration_admin_title,
        },
      });

      const operatorUser = await this.userRepository.findOne({
        where: { operator: { id: clientCreate?.salesRepId } },
      });

      const operator = await this.operatorRepository.findOne({
        where: { full_name: 'System' },
      });

      const notificationData = {
        entity_id: user.id,
        entity_name: 'client',
        description_label_id: label?.id,
        title_label_id: labelTitle?.id,
        created_by: operator?.full_name,
        is_read: false,
        is_deleted: false,
        user_id: operatorUser?.id,
        creator_id: operator?.id,
        admin_description: `A new Client has Signed up and Assigned to you.\n
        Client Name: ${clientCreate?.firstName} ${clientCreate?.lastName}`,
        link,
      };

      await this.notificationService.createNotification({
        ...notificationData,
      });
    }

    const checkFor: RegulationRuleKeys[] = [RegulationRuleKeys.on_kyc_approval];

    const regulationConfig =
      await this.regulationsConfigService.isAllowedInRegulation(
        regulation.id,
        RegulationEventKeys.mt5_live_account_creation,
        checkFor,
      );

    if (regulationConfig[0] === true) {
      const taskLabel = await this.labelRepository.findOne({
        where: {
          key: TaskLabel.clientregistration_contact_details,
        },
      });

      const findTask = await this.masterTaskService.findByName(
        TaskLabel.clientregistration_contact_details,
      );

      await this.masterTaskService.createUserTask({
        user: { id: user.id },
        label: { id: taskLabel?.id || 1 },
        task: { id: findTask?.id || 1 },
        isForced: findTask?.isForcedComplete || true,
        dateTime: new Date(),
        url: findTask?.masterUrl || '',
        isCompleted: false,
      });
    }

    // this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
    //   action: 'RecordCreated',
    //   entity_id: user.id,
    //   entity_type: 'User',
    //   json_object: user,
    //   performer_id: user.id,
    //   performer_type: 'User',
    //   is_from_archive: 0,
    //   trigger_type: 'Default',
    // });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: clientCreate,
      oldData: null,
      entityId: user.id,
      entityType: 'User',
      performerId: user.id,
      performerType: 'User',
      field: 'Client Created',
    });

    const label = await this.labelRepository.findOne({
      where: { description: NotificationMessages.clientregistration_signup },
    });

    const labelTitle = await this.labelRepository.findOne({
      where: {
        description: NotificationTitles.clientregistration_signup_title,
      },
    });

    const operator = await this.operatorRepository.findOne({
      where: { full_name: 'System' },
    });

    const notificationData = {
      entity_id: user?.id,
      entity_name: 'clients',
      description_label_id: label?.id,
      title_label_id: labelTitle?.id,
      created_by: 'System',
      is_read: false,
      is_deleted: false,
      user_id: user?.id,
      creator_id: operator?.id,
    };

    await this.notificationService.createNotification({ ...notificationData });

    if (dto.otpId) {
      await this.otpRepository.update(dto.otpId, {
        isVerified: false,
        entityId: user?.id?.toString(),
      });
    }

    const isSuccess = i18n?.t('success.auth.userRegistered');
    if (refCode && refUuid) {
      await this.referralProgramService.addReferral(userInfo.id, {
        code: refCode,
        uuid: refUuid,
      });
    }

    return {
      message: isSuccess,
      data: userInfo,
      token,
      tokenExpires,
    };
  }

  async registerBroker(dto: AuthRegisterBrokerDto): Promise<any> {
    const i18n = I18nContext.current();
    const isExist = await this.emailExists({
      email: dto.email,
    });

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

    const password = this.randomPasswordService.generatePassword(15);
    const userVerification = await this.userVerificationRepository.findOne({
      where: {
        id: dto.verificationId,
        mobile: `+${dto.telephonePrefix}${dto.telephone}`,
        email: dto.email,
      },
    });

    if (
      userVerification === null ||
      (!userVerification.isMobileVerified && !userVerification.isEmailVerified)
    ) {
      const message = await i18n?.t('errors.auth.otpEmailNumberNotVerified');
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
    const user = await this.clientsService.createBroker({
      ...dto,
      // status: {
      //   id: StatusEnum.active,
      // } as Status,
      status: dto.status,
    });
    const client = await this.clientRepository.findOne({
      where: { userId: user.id },
      relations: {
        regulation: true,
      },
    });
    const regulation = client?.regulations;
    const regulationId = client?.regulation?.id;
    console.log('regulationId: ', regulationId);
    await this.mailService.sendWelcomeEmails({
      to: dto.email,
      context: {
        firstName: user?.firstName ?? '',
        userName: user?.email ?? '',
        password: password,
        accessLink: `${this.configService.getOrThrow('app.frontendDomain', {
          infer: true,
        })}/login`,
      },
      userId: user?.id,
      regulation,
      regulationId,
    });

    await this.userRepository.save(
      await this.userRepository.create({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: password,
        isPartner: true,
        status: { id: 1 },
      }),
    );

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: null,
      oldData: null,
      entityId: user.id,
      entityType: 'Affiliate',
      performerId: user.id,
      performerType: 'Affiliate',
      field: 'Partner Created',
    });

    const isSuccess = i18n?.t('success.auth.brokerRegistered');

    return {
      message: isSuccess,
    };
  }

  async confirmEmail(hash: string): Promise<void> {
    const i18n = I18nContext.current();
    let userId: User['id'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: User['id'];
      }>(hash, {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
      });

      userId = jwtData.confirmEmailUserId;
    } catch {
      const message = await i18n?.t('errors.auth.invalidHash');
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

    const user = await this.clientsService.findOne({
      id: userId,
    });

    if (!user || user?.status?.id !== StatusEnum.inactive) {
      const message = await i18n?.t('errors.auth.userNotFound');
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

    user.status = plainToClass(Status, {
      id: StatusEnum.active,
    });
    await user.save();
  }

  generateHash() {
    const hashBuffer = crypto.randomBytes(16);
    const genHash = crypto.createHash('sha256');
    genHash.update(hashBuffer);
    const hash = genHash.digest('hex');
    return hash;
  }

  async forgotPassword(email: string) {
    const i18n = I18nContext.current();
    const user = await this.clientsService.findOne({
      email,
    });

    if (!user) {
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

    let hash = '';

    const resetPassword = await this.resetPasswordRepository.findOne({
      where: { user: { id: user.id }, status: ResetPasswordStatus.ACTIVE },
    });

    const otpExpire = await this.resetPasswordRepository.findOne({
      where: {
        user: { id: user.id },
        status: ResetPasswordStatus.ACTIVE,
        expireAt: MoreThan(new Date()),
      },
    });

    let generatedOtp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    if (!resetPassword) {
      hash = this.generateHash();
      await this.resetPasswordRepository.save({
        hash,
        user: { id: user.id },
        status: ResetPasswordStatus.ACTIVE,
        otp: generatedOtp,
        expireAt: new Date(Date.now() + 30 * 60 * 1000),
      });
    } else {
      hash = resetPassword.hash;
      if (otpExpire) {
        generatedOtp = resetPassword.otp;
      } else {
        generatedOtp = otpGenerator.generate(6, {
          digits: true,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });
        await this.resetPasswordRepository.update(
          { id: resetPassword.id },
          {
            expireAt: new Date(Date.now() + 30 * 60 * 1000),
            otp: generatedOtp,
          },
        );
      }
    }

    const baseUrl =
      user.isOperator && user.operator
        ? this.configService.getOrThrow('app.crmFrontEndUrl', {
            infer: true,
          })
        : this.configService.getOrThrow('app.frontendDomain', {
            infer: true,
          });

    const url = new URL(baseUrl + '/reset-password');

    const _client = await this.clientRepository.findOne({
      where: { userId: user.id },
      relations: ['regulation'],
    });

    await this.mailService.forgotPassword({
      to: email,
      data: {
        hash,
        url,
        userId: user.id,
        regulation: _client?.regulation.name,
        regulationId: _client?.regulation.id,
        otp: generatedOtp,
      },
    });

    return {
      msg: 'Email has been sent successfully',
    };
  }

  async resetPassword(hash: string, password: string, otp: string) {
    const i18n = I18nContext.current();
    let isExist: ResetPassword | null = null;

    if (hash) {
      isExist = await this.resetPasswordRepository.findOne({
        where: {
          hash,
          status: ResetPasswordStatus.ACTIVE,
        },
      });
    } else if (otp) {
      isExist = await this.resetPasswordRepository.findOne({
        where: {
          otp,
          status: ResetPasswordStatus.ACTIVE,
          expireAt: MoreThan(new Date()),
        },
      });
    }

    if (!isExist) {
      throw new BadRequestException('Invalid otp or hash');
    }

    const user = await this.clientsService.findOne({
      id: isExist?.user.id,
    });

    if (!user) {
      const message = await i18n?.t('errors.auth.userNotFound');
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

    //manual hash expired check
    // const currentDate = new Date();
    // const tokenCreatedAt = new Date(isExist.createdAt);

    // // Convert tokenCreatedAt to UTC
    // const tokenCreatedAtUTC = new Date(tokenCreatedAt.toISOString());
    // const currentDateUTC = new Date(currentDate.toISOString());

    // const expirationDateUTC = new Date(tokenCreatedAtUTC.getTime() + (expirationDuration * 60 * 1000)); // Add the expiration duration (in minutes) to the token creation time

    // if (currentDateUTC.getTime() > expirationDateUTC.getTime()) {
    //   // Update the expiresAt field with the current date before throwing the exception
    //   await this.resetPasswordRepository.update(
    //     { user: { id: user.id }, hash },
    //     { expireAt: currentDateUTC }
    //   );

    //   throw new BadRequestException('Token Expired');
    // }

    user.password = password;

    await this.sessionService.softDelete({
      user: {
        id: user.id,
      },
    });

    await this.resetPasswordRepository.softDelete({
      id: isExist?.id,
    });

    await this.resetPasswordRepository.update(
      { id: isExist?.id },
      { status: ResetPasswordStatus.INACTIVE },
    );
    await user.save();

    if (user.isOperator && user.operator) {
      const operator = await this.operatorRepository.findOne({
        where: { id: user.operator.id },
      });
      await this.operatorRepository.save({
        ...operator,
        password: user.password,
      });
    }
  }

  async verifyForgotPasswordOtp(otp: string, email: string) {
    let isExist: ResetPassword | null = null;
    isExist = await this.resetPasswordRepository.findOne({
      where: {
        otp,
        status: ResetPasswordStatus.ACTIVE,
        expireAt: MoreThan(new Date()),
        user: { email },
      },
      relations: {
        user: true,
      },
    });

    if (!isExist) {
      throw new BadRequestException('Invalid otp');
    }

    return {
      message: 'Otp is valid',
      isOtpValid: true,
    };
  }

  async changePassword(
    userJwtPayload: JwtPayloadType,
    userPasswords: AuthChangePasswordDto,
  ): Promise<void> {
    const userId: User['id'] = userJwtPayload.id;
    const i18n = I18nContext.current();

    const user = await this.clientsService.findOne({
      id: userId,
    });

    // if (user?.role?.id === RoleEnum.super_admin) {
    //   const message = await i18n?.t('errors.auth.adminPassword');
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.FORBIDDEN,
    //       error: {
    //         msg: message,
    //       },
    //     },
    //     HttpStatus.FORBIDDEN,
    //   );
    // }

    if (!user) {
      const message = await i18n?.t('errors.auth.userNotFound');
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

    const isValidPassword = bcrypt.compareSync(
      userPasswords.old_password,
      user.password,
    );

    if (!isValidPassword) {
      const message = i18n?.t('errors.auth.incorrectPassword');
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

    if (userPasswords.old_password == userPasswords.new_password) {
      const message = await i18n?.t('errors.auth.oldPasswordNewPassword');
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: {
            msg: message,
          },
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    user.password = userPasswords.new_password;

    // await this.sessionRepository.softDelete({
    //   user: {
    //     id: user.id,
    //   },
    // });

    await user.save();

    if (user.isOperator && user.operator) {
      const operator = await this.operatorRepository.findOne({
        where: { id: user.operator.id },
      });

      if (!userPasswords?.otpId) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: {
              msg: 'Verification id is required',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      await this.otpService.isOTPisVerifiedinTimeSpan({
        verificationId: userPasswords?.otpId,
        email: operator?.email ?? '',
        type: OtpTypes.reset_password,
      });

      await this.operatorRepository.save({
        ...operator,
        password: userPasswords.new_password,
      });

      this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
        action: 'DetailsUpdated',
        entity_id: user.operator.id,
        entity_type: 'Operator',
        json_object: operator,
        performer_id: user.operator.id,
        performer_type: 'Operator',
        is_from_archive: 0,
        trigger_type: 'Default',
      });

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: null,
        oldData: null,
        entityId: user.operator.id,
        entityType: 'Operator',
        performerId: user.operator.id,
        performerType: 'Operator',
        field: 'Password Update',
      });

      if (
        process.env.AUTH_LOGIN_OTP_ENABLE === 'true' &&
        userPasswords?.otpId
      ) {
        await this.otpRepository.update(userPasswords?.otpId, {
          isVerified: false,
          entityId: user.operator.id?.toString(),
        });
      }
    } else {
      this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
        action: 'DetailsUpdated',
        entity_id: user.id,
        entity_type: 'User',
        json_object: user,
        performer_id: user.id,
        performer_type: 'User',
        is_from_archive: 0,
        trigger_type: 'Default',
      });

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: null,
        oldData: null,
        entityId: user.id,
        entityType: 'User',
        performerId: user.id,
        performerType: 'User',
        field: 'Password Update',
      });
    }

    await this.sessionRepository.softDelete({
      user: {
        id: user.id,
      },
    });
    await this.cacheManager.del(`get-me-api-${user.id}`);
  }

  async me(
    userJwtPayload: JwtPayloadType,
  ): Promise<NullableType<UserWithWallet> | NullableType<any>> {
    // Utility and keys for omitting sensitive fields
    const omitKeys = (obj: any, keys: string[]) => {
      if (!obj) return obj;
      const newObj = { ...obj };
      keys.forEach((key) => {
        delete newObj[key];
      });
      return newObj;
    };
    const operatorKeysToRemove = [
      'imap_host',
      'imap_port',
      'imap_password',
      'imap_protocol',
      'imap_ssl_enabled',
      'imap_ssl_protocol',
      'imap_folders',
      'smtp_host',
      'smtp_port',
      'smtp_password',
      'smtp_protocol',
      'smtp_transport_strategy',
    ];
    const clientData = await this.clientsService.findOne(
      {
        email: userJwtPayload.email || '',
        isOperator: false,
        status: {
          id: 1,
        },
      },
      true,
    );

    if (!clientData) {
      let partnerLink, manager;

      if (!userJwtPayload.role?.id) {
        throw new UnauthorizedException("You don't have access");
      }
      const permission = await this.roleService.getPermissionEndpoint(
        userJwtPayload.role?.id,
      );
      const data = await this.userRepository.findOne({
        where: { id: userJwtPayload.id },
      });
      if (data?.isOperator && data?.operator) {
        if (data?.operator?.partnerId) {
          partnerLink = await this.partnerLinkRepository.findOne({
            where: { partnerId: data?.operator?.partnerId },
          });
        }
        if (data?.operator?.manager_operator_id)
          manager = await this.operatorRepository.findOne({
            where: { id: data?.operator?.manager_operator_id },
          });
      }
      const roleFilterData = await this.roleService?.roleFilterData(
        userJwtPayload?.role?.id as number,
      );
      const levelFilters = roleFilterData?.level?.ids.map((id) =>
        LevelEnum.find((level) => level.id === id),
      );
      const widget = await this.roleService.getDashboardWidget(
        userJwtPayload.role?.id || 1,
      );

      if (data && data.photo && data.photo.id) {
        const url = await this.fileService.getSignedUrl(data.photo.id);
        data.photo = {
          ...(data.photo as any),
          url: url,
        };
      }

      let filteredData: any = omitKeys(data, operatorKeysToRemove);
      let operator = data?.operator
        ? omitKeys(data.operator, operatorKeysToRemove)
        : null;
      if (operator) {
        filteredData.operator = operator;
      }
      return {
        result: {
          ...filteredData,
          partnerLink: partnerLink ?? null,
          manager: manager ?? null,
        },
        role: {
          ...permission,
          roleFilters: levelFilters,
        },
        meta: widget,
      };
    }

    let userDetails: NullableType<UserWithWallet> = clientData;
    if (userDetails?.wallets && userDetails.wallets.length) {
      userDetails.wallet = userDetails.wallets[0];
    }
    const role = await this.roleRepository.findOne({
      where: { name: 'Super Admin' },
    });
    if (role && userDetails?.role?.id === role.id) {
      return userDetails;
    }

    const kycStatus = await this.customStatusRepository.findOne({
      where: { id: userDetails?.client.kycStatus },
      select: {
        id: true,
        name: true,
      },
    });

    if (userDetails && userDetails.client && userDetails.client.kycStatus) {
      userDetails.client = {
        ...(userDetails?.client as any),
        kycStatusName: kycStatus?.name,
      };
    }

    if (userDetails && userDetails.photo && userDetails.photo.id) {
      const url = await this.fileService.getSignedUrl(userDetails.photo.id);
      userDetails.photo = {
        ...(userDetails.photo as any),
        url: url,
      };
    }

    const userRegulationsId = userDetails?.client?.regulation?.id;
    let allowedMethods: AllowMethods[] = [];
    if (userRegulationsId) {
      const methods = await this.transactionMethodRepository.find({
        where: {
          regulations: {
            regulation: {
              id: userRegulationsId,
            },
          },
        },
        relations: {
          regulations: {
            regulation: true,
          },
        },
      });
      if (methods.length) {
        try {
          const localMethods = await this.bankAccountService.getCountryBankAndMethods(userRegulationsId, userDetails.id)
          if (localMethods) {
            //@ts-expect-error type error
            methods.push(localMethods)
          }
        } catch (error) {
          console.error(error, "ERROR")
        }
      }
      const allMethods = methods.map((method) => {
      
        let depositFeeValue = method.clientDepositFeeStart.toString();

        if (method.clientDepositFeeType === FeeType.PERCENTAGE) {
          depositFeeValue += '%';
        }

        if (method.clientDepositFeeStart !== method.clientDepositFeeEnd) {
          depositFeeValue += ' - ' + method.clientDepositFeeEnd;

          if (method.clientDepositFeeType === FeeType.PERCENTAGE) {
            depositFeeValue += '%';
          }
        }

        let withdrawalFeeValue = method.clientWithdrawalFeeStart.toString();

        if (method.clientWithdrawalFeeType === FeeType.PERCENTAGE) {
          withdrawalFeeValue += '%';
        }

        if (method.clientWithdrawalFeeStart !== method.clientWithdrawalFeeEnd) {
          withdrawalFeeValue += ' - ' + method.clientWithdrawalFeeEnd;

          if (method.clientWithdrawalFeeType === FeeType.PERCENTAGE) {
            withdrawalFeeValue += '%';
          }
        }

        let config: any = null;
        try {
          const userRegulation = method?.regulations?.find(
            // just added ? to fix type error, rest is usmans work
          (r) => r.regulation.id === userRegulationsId,
        );
          if (userRegulation && userRegulation.config) {
            const objectJson = JSON.parse(userRegulation.config);
            config = objectJson;
          }
        } catch (error) {
          console.error(error);
        }

        //@ts-ignore
        delete method.regulations;

        return {
          ...method,
          depositFeeValue,
          withdrawalFeeValue,
          config,
        };
      });
      if (allMethods.length) {
        //@ts-expect-error type error
        allowedMethods = allMethods;
      }
    }

    if (userDetails.client) {
      userDetails.client.allowedMethods = allowedMethods;
    }

    userDetails = omitKeys(userDetails, operatorKeysToRemove);
    if (userDetails && userDetails.client.regulation) {
      userDetails.client.regulation = omitKeys(
        userDetails.client.regulation,
        operatorKeysToRemove,
      );
    }

    const [isAutoMT5CreationOnFTD] =
      await this.regulationsConfigService.isAllowedInRegulation(
        userRegulationsId,
        RegulationEventKeys.mt5_live_account_creation,
        [RegulationRuleKeys.on_ftd],
      );

    const userCountry = await this.billingInformationRepository.findOne({
      where:{
        user:{
          id:userDetails?.id
        },
      },
      relations:{
        countryInfo:{
          currency:true
        }
      }
    });

    let currency : Currencies | undefined | null = userCountry?.countryInfo?.currency;
    if(!currency){
      currency = await this.currenciesRepository.findOne({
        where:{
          iso:"USD"
        }
      });
    }
    //@ts-expect-error type-error
    userDetails?.client.currency = currency;
    //@ts-expect-error type-error
    userDetails?.client.regulation.isAutoMT5CreationOnFTD = isAutoMT5CreationOnFTD;
    return userDetails;
  }

  async update(
    userJwtPayload: JwtPayloadType,
    userDto: AuthUpdateDto,
  ): Promise<NullableType<User>> {
    const i18n = I18nContext.current();
    const currentUser = await this.clientsService.findOne({
      id: userJwtPayload.id,
    });
    let regulationCountry: NullableType<RegulationsCountries> = null;
    let partnerType: NullableType<PartnerType> = null;

    if (userDto.partnerTypeId && userDto.partnerTypeId > 0) {
      partnerType = await this.partnerTypeRepository.findOne({
        where: { id: userDto.partnerTypeId },
      });
    }

    if (!currentUser) {
      const message = await i18n?.t('errors.auth.userNotFound');
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

    if (currentUser.isOperator && currentUser.operator) {
      await this.userRepository.save({
        ...currentUser,
        photo: { id: userDto?.photo?.id },
        totp: userDto?.totp || false,
        emailOtp: userDto?.emailOtp || false,
        mobileOtp: userDto?.mobileOtp || false,
        isTotpDefault: userDto?.isTotpDefault || false,
        isEmailOtpDefault: userDto?.isEmailOtpDefault || false,
        isMobileOtpDefault: userDto?.isMobileOtpDefault || false,
      });

      const operator = await this.operatorRepository.findOne({
        where: {
          id: currentUser.operator.id,
        },
      });

      await this.operatorRepository.save({
        ...operator,
        photo: { id: userDto?.photo?.id },
      });

      const data = await this.clientsService.findOne({
        id: userJwtPayload.id,
      });

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: userDto,
        oldData: currentUser,
        entityId: currentUser.id,
        entityType: 'Operator',
        performerId: userJwtPayload.id,
        performerType: 'Operator',
        field: 'Operator Update',
      });

      await this.cacheManager.del(`get-me-api-${currentUser.id}`);

      return data;
    } else {
      if (currentUser.client.customKycStatus.name !== 'No KYC') {
        const profileInfo = [
          'firstName',
          'lastName',
          'email',
          'telephone',
          'telephonePrefix',
          'address',
          'city',
          'state',
          'country',
          'dob',
          'countryIso',
        ];
        const hasRestrictedFields = profileInfo.some(
          (field) => field in userDto,
        );
        if (hasRestrictedFields) {
          throw new BadRequestException(
            'You are not allowed to update this field',
          );
        }
      }

      if (!currentUser.client.zip) {
        userDto.zip = '00000';
      }

      if (userDto.firstName || userDto.lastName) userDto.fullName = `${userDto.firstName || ''} ${userDto.lastName || ''}`;

      if (userDto.country) {
        regulationCountry = await this.regulationsCountriesRepository.findOne(
          {
            where: {
              countryCode: userDto.countryIso || '',
            },
            relations: ['regulation'],
          },
        );

        if (!regulationCountry) {
          const message = await i18n?.t('errors.auth.countryBlocked');
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              error: { msg: message },
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
        const countries = this.settingsService.getCountriesIso();
        const isoIndex = countries.result.findIndex(
          (country) => country.printableName === userDto.country,
        );
        if (isoIndex !== -1 && !currentUser.client.city) {
          userDto.city = countries.result[isoIndex]?.capital;
          if(!userDto.address && !currentUser.address) {
            userDto.address = userDto.city;
          }
        }

        let countryInfo: Countries | null | undefined;
        if (userDto.countryIso) {
          countryInfo = await this.countriesRepository.findOne({
            where: {
              iso: userDto.countryIso
            }
          });
        }

        await this.billingInformationRepository.update({ user: { id: currentUser.id } }, {
          country: userDto.countryIso,
          city: userDto.city,
          postalCode: userDto.zip,
          address: userDto.address,
          phone: `${userDto.telephonePrefix} ${userDto.telephone}`,
          ...(countryInfo ? {countryInfo} : {})
        });
      }
      const userUpdated = await this.clientsService.update(
        userJwtPayload.id,
        userDto,
      );

      await this.clientsService.updateClientInfo(userUpdated, {
        ...userDto,
        partnerType: partnerType?.title,
        regulations: regulationCountry?.regulation?.name,
        regulation: regulationCountry?.regulation?.id,
      });

      const data = await this.clientsService.findOne({
        id: userJwtPayload.id,
      });

      const leadUpdateData = {};
      if (userDto.email) {
        leadUpdateData['email'] = data?.email;
        // Email change should invalidate all active sessions for security
        if (currentUser.email !== userDto.email) {
          await this.sessionService.softDelete({
            id: userJwtPayload.sessionId,
          });
        }
      }
      if (userDto.firstName) leadUpdateData['firstName'] = data?.firstName;
      if (userDto.lastName) leadUpdateData['lastName'] = data?.lastName;
      if (userDto.firstName || userDto.lastName) leadUpdateData['title'] = `${userDto.firstName || ''} ${userDto.lastName || ''}`;
      if (userDto.telephone) {
        leadUpdateData['telephone'] = data?.telephone;
        leadUpdateData['telephonePrefix'] = data?.telephonePrefix;
        leadUpdateData['phoneNumber'] =
          `${data?.telephonePrefix}${data?.telephone}`;
      }
      if (userDto.zip) leadUpdateData['zipCode'] = data?.client?.zip;
      if (userDto.city) leadUpdateData['city'] = data?.city;
      if (userDto.state) leadUpdateData['state'] = data?.state;
      if (userDto.country) {
        leadUpdateData['country'] = data?.country;
        leadUpdateData['countryIso'] = data?.countryIso;
      }
      if (userDto.dob) leadUpdateData['dateOfBirth'] = data?.dob;

      if (partnerType) leadUpdateData['type'] = partnerType?.title;
      if (partnerType) leadUpdateData['companyName'] = partnerType?.title;

      if (regulationCountry) leadUpdateData['regulations'] = regulationCountry?.regulation?.name;
      if (regulationCountry) leadUpdateData['regulation'] = regulationCountry?.regulation;

      if (Object.keys(leadUpdateData).length > 0) {
        await this.leadRepository.update(
          { id: currentUser.client.leadId },
          leadUpdateData,
        );
      }

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: userDto,
        oldData: currentUser,
        entityId: currentUser.id,
        entityType: 'User',
        performerId: userJwtPayload.id,
        performerType: 'User',
        parentId: currentUser.client.leadId,
        parentType: 'Lead',
        field: 'User Update',
      });
      // this.eventEmitter.emit(EventTypes.USER_LOG, {
      //   newData: userDto,
      //   oldData: currentUser,
      //   entityId: currentUser.client.leadId,
      //   entityType: 'Lead',
      //   performerId: userJwtPayload.id,
      //   performerType: 'User',
      //   field: 'Lead Updated',
      // });

      await this.cacheManager.del(`get-me-api-${currentUser.id}`);

      return data;
    }
  }

  async updateSteps(
    userId: number,
    stepsUpdateDto: StepsUpdateDto,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const currentUser = await this.clientsService.findOne({ id: userId });
    const updatedLang = currentUser?.languageIso.toLocaleUpperCase();
    const system_operator = await this.operatorRepository.findOne({
      where: { full_name: 'System' },
    });
    if (!currentUser) {
      const message = i18n?.t('errors.auth.userNotFound');
      throw new HttpException({ message: message }, HttpStatus.NOT_FOUND);
    }

    if (!currentUser.email) {
      throw new HttpException(
        { message: 'An Error occurred' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!system_operator) {
      throw new HttpException(
        { message: 'System operator not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    // if (stepsUpdateDto.completedSteps === 1) {
    //   const client = await this.clientRepository.findOne({
    //     where: { userId },
    //     relations: {
    //       regulation: true,
    //     },
    //   });

    //   if (!client) {
    //     const message = i18n?.t('errors.auth.userNotFound');
    //     throw new HttpException({ message: message }, HttpStatus.NOT_FOUND);
    //   }

    //   await this.sendEmailService.sendEmailToClient({
    //     entityName: 'client',
    //     entityValue: currentUser.id as any,
    //     createdForId: currentUser.id,
    //     emailEventName: 'CLIENT_STEP_1',
    //     operatorId: system_operator.id,
    //     externalVariables: { password: '*********' },
    //     userAgreement: {
    //       step: stepsUpdateDto.completedSteps,
    //       uuid: currentUser.uuid,
    //     },
    //   });

    //   // await this.mailService.sendAgreementEmail({
    //   //   to: currentUser.email,
    //   //   uuid: currentUser.uuid,
    //   //   docsUploaded: false,
    //   //   firstName: currentUser.firstName ?? '',
    //   //   password: '********',
    //   //   userId,
    //   //   regulation: client?.regulations,
    //   //   regulationId: client?.regulation?.id,
    //   //   step: 1,
    //   // });

    //   const label = await this.labelRepository.findOne({
    //     where: {
    //       description: NotificationMessages.clientregistration_contact_details,
    //     },
    //   });

    //   const labelTitle = await this.labelRepository.findOne({
    //     where: {
    //       description:
    //         NotificationTitles.clientregistration_contact_details_completed_title,
    //     },
    //   });

    //   const notificationData = {
    //     entity_id: currentUser?.id,
    //     entity_name: 'clients',
    //     description_label_id: label?.id,
    //     title_label_id: labelTitle?.id,
    //     created_by: 'system',
    //     is_read: false,
    //     is_deleted: false,
    //     user_id: currentUser?.id,
    //     creator_id: system_operator?.id,
    //   };

    //   await this.notificationService.createNotification({
    //     ...notificationData,
    //   });
    // }

    if (stepsUpdateDto.completedSteps === 2) {
      const label = await this.labelRepository.findOne({
        where: {
          description: NotificationMessages.clientregistration_financial_info,
        },
      });

      const labelTitle = await this.labelRepository.findOne({
        where: {
          description:
            NotificationTitles.clientregistration_financial_info_completed_title,
        },
      });

      const notificationData = {
        entity_id: currentUser?.id,
        entity_name: 'clients',
        title_label_id: labelTitle?.id,
        description_label_id: label?.id,
        created_by: 'system',
        is_read: false,
        is_deleted: false,
        user_id: currentUser?.id,
        creator_id: system_operator?.id,
      };

      await this.notificationService.createNotification({
        ...notificationData,
      });
    }

    if (stepsUpdateDto.completedSteps === 3) {
      const label = await this.labelRepository.findOne({
        where: {
          description:
            NotificationMessages.clientregistration_expereince_kycdocs,
        },
      });

      const labelTitle = await this.labelRepository.findOne({
        where: {
          description:
            NotificationTitles.clientregistration_experience_completed_title,
        },
      });

      const notificationData = {
        entity_id: currentUser?.id,
        entity_name: 'clients',
        title_label_id: labelTitle?.id,
        description_label_id: label?.id,
        created_by: 'system',
        is_read: false,
        is_deleted: false,
        user_id: currentUser?.id,
        creator_id: system_operator?.id,
      };

      await this.notificationService.createNotification({
        ...notificationData,
      });
    }
    if (stepsUpdateDto.completedSteps === 4) {
      const client = await this.clientRepository.findOne({
        where: { userId },
        relations: {
          regulation: true,
        },
      });

      const lead = await this.leadRepository.findOne({
        where: { email: currentUser.email },
      });

      if (lead) {
        await this.leadRepository.save(
          this.leadRepository.create({
            ...lead,
            userLifeCycle: UserLifeCycle.APPLICANT,
            applicantCreatedTime: lead.applicantCreatedTime ?? new Date(),
          }),
        );
      }

      if (
        client &&
        (client.userLifeCycle === UserLifeCycle.LEAD ||
          client.userLifeCycle === UserLifeCycle.REGISTERED)
      ) {
        await this.clientRepository.save(
          this.clientRepository.create({
            ...client,
            userLifeCycle: UserLifeCycle.APPLICANT,
          }),
        );
      }

      const mailPayload = {
        to: currentUser.email,
        uuid: currentUser.uuid,
        firstName: currentUser.firstName ?? '',
        password: '********',
        userId,
      };

      const documentUploaded =
        await this.userKycDocumentsService.isAnyDocumentUploaded(userId);
      if (!documentUploaded) {
        if (updatedLang === 'AR') {
          await this.userKycDocumentsService.sendEmailKyc({
            template: KycTemplateNames.KYC_NOT_STARTED,
            title: KycTemplateSubject_AR.KYC_NOT_STARTED,
            userId,
          });
        } else if (updatedLang === 'EN') {
          await this.userKycDocumentsService.sendEmailKyc({
            template: KycTemplateNames.KYC_NOT_STARTED,
            title: KycTemplateSubject_EN.KYC_NOT_STARTED,
            userId,
          });
        }
        //event for world check compliance service
        // await this.worldCheckService.sendTopicToWorldCheckService(
        //   { userId },
        //   'check-user-compliance',
        // );
        await this.mailService.sendAgreementEmail({
          to: currentUser.email,
          uuid: currentUser.uuid,
          docsUploaded: false,
          firstName: currentUser.firstName ?? '',
          password: '********',
          userId,
          regulation: client?.regulations,
          step: 4,
          regulationId: client?.regulation?.id,
        });

        const label = await this.labelRepository.findOne({
          where: {
            description:
              NotificationMessages.clientregistration_kyc_under_review,
          },
        });

        const labelTitle = await this.labelRepository.findOne({
          where: {
            description:
              NotificationTitles.clientregistration_kyc_under_review_title,
          },
        });

        const notificationData = {
          entity_id: currentUser?.id,
          entity_name: 'clients',
          title_label_id: labelTitle?.id,
          description_label_id: label?.id,
          created_by: 'system',
          is_read: false,
          is_deleted: false,
          user_id: currentUser?.id,
          creator_id: system_operator?.id,
        };

        await this.notificationService.createNotification({
          ...notificationData,
        });
      } else {
        await this.mailService.sendAgreementEmail({
          to: currentUser.email,
          uuid: currentUser.uuid,
          docsUploaded: true,
          firstName: currentUser.firstName ?? '',
          password: '********',
          userId,
          regulation: client?.regulations,
          step: 4,
          regulationId: client?.regulation?.id,
        });
      }
      try {
        const kycStatusName = 'Approved';
        const systemUserId = system_operator?.id;

        const kycStatusDetails = await this.customStatusRepository.findOne({
          where: { name: kycStatusName, type: 'kyc_status' as any },
        });

        if (!kycStatusDetails) {
          this.logger.warn(`KYC status '${kycStatusName}' not found`);
        } else {
          const kycUpdate = { kycStatus: kycStatusDetails.id };

          this.clientsService
            .updateClientKycInfo(userId, kycUpdate, systemUserId)
            .then(() => {
              this.logger.log(
                `✅ KYC status updated for user ${userId} to '${kycStatusName}'`,
              );
            })
            .catch((err) => {
              this.logger.error(
                `❌ KYC status update failed for user ${userId}: ${err.message}`,
              );
            });
        }
      } catch (err) {
        this.logger.error(
          `⚠️ Unexpected error during KYC status update for user ${userId}: ${err.message}`,
        );
      }
    }

    const steps = await this.clientsService.createSteps(userId, stepsUpdateDto);

    const currentDate = new Date();

    const admin = await this.userRepository.findOne({
      where: {
        role: { id: RoleEnum.super_admin },
        isOperator: true,
        operator: Not(IsNull()),
      },
    });

    const lead = await this.leadRepository.findOne({
      where: { email: currentUser.email },
    });
    let desk;
    if (lead?.salesDeskId) {
      desk = await this.deskRepository.findOne({
        where: { id: lead.salesDeskId },
        relations: ['coordinator'],
      });
    }
    const task = await this.taskService.create(
      {
        subject: 'Update KYC',
        assignTo: desk?.coordinator
          ? desk.coordinator?.id
          : admin?.operator?.id,
        relatedTo: TaskRelatedTo.LEAD,
        relatedToId: lead?.id,
        status: 'NOT STARTED',
        description: 'User has submitted KYC documents. Please verify.',
        dueDate: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        priority: TaskPriorityLevel.HIGH,
        repeat: 'never',
        contact: lead?.id,
        reminder: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000),
        entity: TaskEntityType.LEAD,
        entityId: lead?.id.toString(),
      } as CreateTaskDto,
      {
        id: admin?.id,
      } as User,
    );

    await this.cacheManager.del(`get-me-api-${userId}`);

    return steps;
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'sessionId'>,
  ): Promise<Omit<LoginResponseType, 'user'>> {
    const session = await this.sessionService.findOne({
      where: {
        id: data.sessionId,
      },
    });

    if (!session) {
      throw new UnauthorizedException();
    }

    // Check if user has 2FA enabled
    const user = session.user;
    const is2FAVerified =
      (user?.emailOtp && user.isEmailOtpDefault) ||
      (user?.totp && user.isTotpDefault) ||
      (user?.mobileOtp && user.isMobileOtpDefault);

    // Build token data
    const tokenData: any = {
      id: session.user.id,
      role: session.user.role,
      languageIso: session.user.languageIso,
      sessionId: session.id,
      email: session.user.email,
      is2FAVerified,
    };

    // Add operator object if user is an operator
    if (user?.isOperator && user?.operator) {
      const operatorIs2FAVerified = user.totp ? true : false;
      tokenData.operator = {
        id: user.operator.id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        is2FAVerified: operatorIs2FAVerified,
        isFirstLogin: user.operator.isFirstLogin || false,
      };
    }

    const { token, tokenExpires } = await this.getTokensData(tokenData);

    return {
      token,
      tokenExpires,
    };
  }

  async softDelete(user: User): Promise<void> {
    await this.cacheManager.del(`get-me-api-${user.id}`);
    await this.clientsService.softDelete(user.id);
  }

  async logout(data: Pick<JwtRefreshPayloadType, 'sessionId'>, req: any) {
    const session = await this.sessionService.findOne({
      where: {
        id: data.sessionId,
      },
    });

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (session?.user.operator) {
      this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
        action: 'RecordCreated',
        entity_id: session.user.operator.id,
        entity_type: 'Operator',
        json_object: ip,
        performer_id: session.user.operator.id,
        performer_type: 'Operator',
        is_from_archive: 0,
        trigger_type: 'Default',
      });

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: ip,
        oldData: null,
        entityId: session.user.operator.id,
        entityType: 'Operator',
        performerId: session.user.operator.id,
        performerType: 'Operator',
        field: 'Operator Logout',
      });
    } else {
      this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
        action: 'RecordCreated',
        entity_id: session?.user.id,
        entity_type: 'User',
        json_object: ip,
        performer_id: session?.user.id,
        performer_type: 'User',
        is_from_archive: 0,
        trigger_type: 'Default',
      });

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: ip,
        oldData: null,
        entityId: session?.user.id,
        entityType: 'User',
        performerId: session?.user.id,
        performerType: 'User',
        field: 'User Logout',
      });
    }
    await this.cacheManager.del(`get-me-api-${session?.user.id}`);
    return this.sessionService.softDelete({
      id: data.sessionId,
    });
  }

  private async getTokensData(data: {
    id: User['id'];
    role: User['role'];
    languageIso: User['languageIso'];
    sessionId: Session['id'];
    email: User['email'];
    is2FAVerified?: boolean;
    operator?: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      is2FAVerified: boolean;
      isFirstLogin: boolean;
    };
  }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const payload: any = {
      id: data.id,
      role: data.role,
      languageIso: data.languageIso,
      sessionId: data.sessionId,
      email: data.email,
      is2FAVerified: data.is2FAVerified ?? false,
    };

    // Add operator object if provided
    if (data.operator) {
      payload.operator = data.operator;
    }

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
        expiresIn: tokenExpiresIn,
      }),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  private async getLongLiveTokensData(data: {
    id: User['id'];
    role: User['role'];
    languageIso: User['languageIso'];
    sessionId: Session['id'];
    email: User['email'];
    is2FAVerified?: boolean;
    operator?: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      is2FAVerified: boolean;
      isFirstLogin: boolean;
    };
  }) {
    const tokenExpiresIn = this.configService.getOrThrow(
      'auth.longLivedTokenExpiry',
      {
        infer: true,
      },
    );

    const tokenExpires = Date.now() + ms(tokenExpiresIn);
    console.log('000000EXPIRE: ', tokenExpires);

    const payload: any = {
      id: data.id,
      role: data.role,
      languageIso: data.languageIso,
      sessionId: data.sessionId,
      email: data.email,
      is2FAVerified: data.is2FAVerified ?? false,
    };

    // Add operator object if provided
    if (data.operator) {
      payload.operator = data.operator;
    }

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
        expiresIn: tokenExpiresIn,
      }),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  async getMessages({
    userId,
    paginationOptions,
    leadId,
    opportunityId,
    send,
  }: {
    userId?: number;
    paginationOptions: IPaginationOptions;
    leadId?: number;
    opportunityId?: number;
    send?: boolean;
  }): Promise<any> {
    if (leadId || opportunityId) {
      const clientId = await this.getClientIdViaLeadId(leadId);
      return await this.mailerService.getLeadCommunication({
        paginationOptions,
        leadId,
        opportunityId,
        clientId,
        send,
      });
    }
    return await this.mailerService.getCommunication({
      userId: userId ?? null,
      paginationOptions,
      leadId,
      opportunityId,
    });
  }

  async getOperatorDetail(operatorId: number): Promise<any> {
    const operatorDetail = await this.operatorRepository.findOne({
      where: {
        id: operatorId,
      },
    });
    return operatorDetail;
  }

  async getClientIdViaLeadId(leadId?: number): Promise<any> {
    const clientId = await this.clientRepository.findOne({
      where: {
        leadId,
      },
    });
    return clientId?.userId;
  }

  async toggleNotification(
    sessionUser: any,
    notificationsSettingsDto: NotificationsSettingsDto,
  ): Promise<any> {
    const i18n = I18nContext.current();

    const user = await this.userRepository.findOneBy({ id: sessionUser.id });
    const message = i18n?.t('errors.auth.userNotFound');
    if (!user) {
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

    const {
      isEmailNotificationsEnabled,
      isWhatsappNotificationsEnabled,
      isSmsNotificationsEnabled,
    } = notificationsSettingsDto;

    await this.userRepository.save({
      ...user,
      isEmailNotificationsEnabled,
      isWhatsappNotificationsEnabled,
      isSmsNotificationsEnabled,
    });

    const isSuccess = i18n?.t('success.auth.notificationSettingsUpdated');

    return {
      message: isSuccess,
    };
  }

  async getUserAgreements(uuid: string): Promise<any> {
    const i18n = I18nContext.current();
    const userUuid = await this.userRepository.findOne({
      where: { uuid: uuid },
    });
    const user = await this.userRepository.findOne({
      where: { id: userUuid?.id },
      relations: { client: true },
    });
    const message = i18n?.t('errors.auth.userNotFound');
    if (!user) {
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
    const userAgreements = await this.userAnswerRepository.find({
      where: { userId: user.id, questionId: Not(1064) },
    });

    let userSignature;

    userSignature = await this.userAnswerRepository.findOne({
      where: { userId: user.id, questionId: 1064 },
    });

    if (!userSignature) {
      userSignature = await this.userAnswerRepository.findOne({
        where: { userId: user.id, questionId: 1105 },
      });
    }

    const response = {
      userType: user.userType,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      telephone: user.telephone,
      telephonePrefix: user.telephonePrefix,
      telephoneValid: user.client.telephoneValid,
      languageIso: user.languageIso,
      id2: user.client.id2,
      address: user.address,
      nationalityIso: user.countryIso,
      country: user.country,
      countryIso: user.countryIso,
      city: user.city,
      affid: user.client.affid,
      groupString: user.client.groupString,
      zip: user.client.zip,
      dateOfBirth: user.client.dateOfBirth,
      userSignature: userSignature?.answerText ?? null,
      userAnswers: userAgreements.map((userAnswer) => ({
        userId: userAnswer.userId,
        questionId: userAnswer.questionId,
        answerId: userAnswer.answerId,
        answerText: userAnswer.answerText,
      })),
      signDate: userSignature?.updatedAt ?? new Date(),
    };
    return response;
  }
  async zapierDataFormatting(data: any): Promise<any> {
    const {
      email,
      full_name,
      country,
      phone_number,
      first_name,
      last_name,
      speakingLanguage,
      ...rest
    } = data?.raw;
    const source = 'Zapier';
    const utmSource = data?.utmSource || 'Meta';

    if (!full_name && !first_name) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: 'Either full_name or first_name is required',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const countryName: string = country ? String(country) : '';

    const questionsData = { ...rest };
    let firstName: string;
    let lastName: string;

    if (full_name) {
      const parts = full_name
        .split(' ')
        .filter((part) => part.trim().length > 0);

      if (parts.length === 0) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: {
              msg: 'Invalid full_name format',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      firstName = first_name || parts[0];
      lastName = last_name
        ? last_name
        : parts.length > 1
          ? parts.slice(1).join(' ')
          : '';
    } else {
      firstName = first_name;
      lastName = last_name || '';
    }

    const languageIso = data?.form_name?.includes('EN') ? 'EN' : 'AR';
    let bodyCountryIso: string;
    let number = phone_number;
    if (!country || countryName?.length > 2) {
      const countries = this.settingsService.getCountriesIso();
      const isoIndex = countries.result.findIndex(
        (country) => country.printableName === countryName,
      );
      if (isoIndex !== -1) {
        bodyCountryIso = countries?.result[isoIndex].iso;
      } else {
        const countryData = this.settingsService.getCountriesIso();
        const cleanNumber = phone_number?.replace(/^(00|\+|0)|\D/g, '');

        const sortedCountries = [...(countryData?.result || [])].sort(
          (a, b) => b.phonePrefix.length - a.phonePrefix.length,
        );

        const match = sortedCountries.find((country) =>
          cleanNumber.startsWith(country.phonePrefix),
        );

        bodyCountryIso = match?.iso || 'AE';
      }
    } else {
      bodyCountryIso = country;
    }
    if (phone_number && !country) {
      const countryData = this.settingsService.getCountriesIso();
      const cleanNumber = phone_number.replace(/^(00|\+|0)|\D/g, '');
      const sortedCountries = [...(countryData?.result || [])].sort(
        (a, b) => b.phonePrefix.length - a.phonePrefix.length,
      );
      const match = sortedCountries.find(
        (country) => country.iso === countryName.toUpperCase(),
      );
      const matchingCountry = cleanNumber.startsWith(match?.phonePrefix);

      if (matchingCountry) {
        number = cleanNumber.substring(match?.phonePrefix.length);
      } else {
        number = cleanNumber;
      }
    }
    const payload = {
      firstName,
      lastName,
      email,
      telephone: number
        ? number.toString()
        : parseInt(data?.phone_number).toString(),
      languageIso,
      speakingLanguage,
      verificationId: 1,
      countryIso: bodyCountryIso.toUpperCase(),
      partnerTypeId: null,
      sc: source,
      isBlockEmails: 'TRUE',
      source,
      leadSource: source,
      utmSource,
      utmCampaign: data?.campaign_name,
      utmMedium: data?.form_name,
      utmContent: data?.ad_name,
    };

    const questions: Array<LeadQuestion> = [];
    const answers: Array<string> = [];

    if (Object.keys(questionsData).length > 0) {
      Object.keys(questionsData)?.map(async (data) => {
        let myQuestion = data.replace(/_/g, ' ');

        myQuestion = myQuestion.charAt(0).toUpperCase() + myQuestion.slice(1);
        const newQuestion = await this.leadQuestionRepository.findOne({
          where: { description: myQuestion },
        });

        if (newQuestion !== null) {
          questions.push(newQuestion);
          answers.push(questionsData[data]);
        }
      });
    }

    try {
      const leadResponse = await this.leadService.create(payload);
      for (const [index, questionRowData] of questions.entries()) {
        const answerPayload: AddAnswerDto = {
          key: questionRowData?.key,
          answer: answers[index],
        };
        await this.leadService.addAnswer(leadResponse?.id, answerPayload);
      }
    } catch (error) {
      throw error;
    }
  }

  async zapierZoomMeetingParticipant(data: ZoomParticipantDto): Promise<any> {
    try {
      const isLeadExists = await this.leadRepository.findOne({
        where: { email: data.email, isActive: true },
        select: [
          'id',
          'minutesOfAttendance',
          'hasAttendedEvent',
          'lastAttendedDate',
          'clientID',
        ],
      });
      const createdBy = await this.userRepository.findOne({
        where: { operator: { full_name: 'System' } },
        relations: ['operator'],
      });

      if (isLeadExists) {
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: {
            minutesOfAttendance: data.duration ? Number(data.duration) : 0,
            hasAttendedEvent: true,
            lastAttendedDate: data.join_time
              ? new Date(data.join_time).toDateString()
              : null,
            eventName: data.topic,
          },
          oldData: {
            minutesOfAttendance: isLeadExists?.minutesOfAttendance,
            hasAttendedEvent: isLeadExists?.hasAttendedEvent,
            lastAttendedDate: isLeadExists?.lastAttendedDate
              ? isLeadExists?.lastAttendedDate.toDateString()
              : null,
          },
          entityId: isLeadExists?.id,
          entityType: 'Lead',
          performerId: createdBy?.operator?.id,
          performerType: 'System',
          field: 'Webinar Attended',
        });
        if (isLeadExists?.userLifeCycle !== null) {
          this.eventEmitter.emit(EventTypes.USER_LOG, {
            newData: {
              minutesOfAttendance: data.duration ? Number(data.duration) : 0,
              hasAttendedEvent: true,
              lastAttendedDate: data.join_time
                ? new Date(data.join_time).toDateString()
                : null,
              eventName: data.topic,
            },
            oldData: {
              minutesOfAttendance: isLeadExists?.minutesOfAttendance,
              hasAttendedEvent: isLeadExists?.hasAttendedEvent,
              lastAttendedDate: isLeadExists?.lastAttendedDate
                ? isLeadExists?.lastAttendedDate.toDateString()
                : null,
            },
            entityId: isLeadExists.clientID,
            entityType: 'User',
            performerId: createdBy?.operator?.id,
            performerType: 'System',
            field: 'Webinar Attended',
          });
        }
        await this.leadRepository.update(isLeadExists.id, {
          minutesOfAttendance: data.duration ? Number(data.duration) : 0,
          hasAttendedEvent: true,
          lastAttendedDate: data.join_time,
        });
      }

      // const currentTime = new Date();
      const webhookData = this.zapierWebhookRepository.create({
        email: data.email,
        // createdAt: currentTime,
        payload: JSON.stringify(data),
      });

      const savedParticipant =
        await this.zapierWebhookRepository.save(webhookData);

      return {
        message: 'Zoom participant data processed successfully',
        participant: savedParticipant,
        leadUpdated: !!isLeadExists,
      };
    } catch (error) {
      console.error('Error processing Zoom participant:', error);
      throw new Error('Failed to process Zoom participant data');
    }
  }

  async findClient(userId: number) {
    return this.clientRepository.findOne({
      where: { userId },
      relations: [
        'regulation',
        'regulation.eventRule',
        'regulation.eventRule.event',
        'regulation.eventRule.rule',
      ],
    });
  }

  async findUserByEmail(email: string, password: string): Promise<any> {
    const i18n = I18nContext.current();
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
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
      password,
      user.password,
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

    return {
      totp: user.totp,
      mobileOtp: user.mobileOtp,
      emailOtp: user.emailOtp,
      isTotpDefault: user.isTotpDefault,
      isMobileOtpDefault: user.isMobileOtpDefault,
      isEmailOtpDefault: user.isEmailOtpDefault,
    };
  }

  async saveFcmToken(sessionId: number, token: string, deviceId: string) {
    return this.sessionService.saveFcmToken(sessionId, token, deviceId);
  }
}
