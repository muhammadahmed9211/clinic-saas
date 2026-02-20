import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  Post,
  UseGuards,
  Patch,
  Delete,
  SerializeOptions,
  Query,
  Param,
  ParseIntPipe,
  ForbiddenException,
  HttpException,
  Ip,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiHeaders, ApiTags } from '@nestjs/swagger';
import {
  AuthEmailLoginDto,
  AuthLoginLongTokenDto,
} from './dto/auth-email-login.dto';
import {
  AuthForgotPasswordDto,
  AuthForgotPasswordOtpDto,
} from './dto/auth-forgot-password.dto';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  AuthRegisterBrokerDto,
  AuthRegisterLoginDto,
  AuthRegisterQueryDto,
} from './dto/auth-register-login.dto';
import { LoginResponseType } from './types/login-response.type';
import { User } from '../users/entities/user.entity';
import { NullableType } from '../utils/types/nullable.type';
import {
  AuthEmailExistsDto,
  AuthEmailExistsDto2,
} from './dto/auth-email-exists.dto';
import { AuthChangePasswordDto } from './dto/auth-change-password.dto';
import { UserAnswersDTO } from './dto/user-kyc-answers.dto';
import { StepsUpdateDto } from './dto/steps-update.dto';
import { GetUser } from './decorator/password.decorator';
import { MessageDto } from './dto/auth-message.dto';
import { NotificationsSettingsDto } from './dto/notifications-settings.dto';
import { MarkMessageAsReadDto } from 'src/users/dto/mark-read.dto';
import { MailerService } from 'src/mailer/mailer.service';
import { I18nContext } from 'nestjs-i18n';
import { LeadsService } from 'src/admin/leads/leads.service';
import { CreateLeadDto } from 'src/admin/leads/dto/create-lead.dto';
import { CacheKeyWithUser } from 'src/common/decorators/cahce-key.decorator';
import { UserBasedCacheInterceptor } from 'src/common/interceptors/user-based-cache-interceptor.interceptor';
import { OtpTypes } from 'src/users/entities/otp.entity';
import { OtpService } from 'src/otp/otp.service';
import { SkipMasking } from 'src/common/decorators/skip-masking.decorator';
import { TokenByEmailDTO } from 'src/users/dto/2fa-client.dto';
import { ClientsService } from 'src/users/clients.service';
import { OperatorRole, Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { ZoomParticipantDto } from './dto/auth-zapier-zoom-meeting.dto';
import { SaveFcmTokenDto } from './dto/fcm.dto';
import { AllowFirstLogin } from './decorators/allow-first-login.decorator';
import { Require2FA } from './decorators/require-2fa.decorator';

@ApiTags('Admin Auth')
@Controller({
  path: 'admin/auth',
  version: '1',
})
export class AdminAuthController {
  constructor(private readonly service: AuthService) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('email/login')
  @ApiHeaders([{ name: 'x_device_id', schema: { type: 'string' } }])
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: AuthEmailLoginDto,
    @Request() request,
  ): Promise<LoginResponseType> {
    if (loginDto.isOperator === false) {
      throw new ForbiddenException('Only operator can access this endpoint');
    }
    return this.service.validateLogin(
      loginDto,
      request,
      request.headers['x_device_id'],
    );
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('email/long-lived-token')
  @ApiHeaders([{ name: 'x_device_id', schema: { type: 'string' } }])
  @HttpCode(HttpStatus.OK)
  public async loginLongToken(
    @Body() loginDto: AuthLoginLongTokenDto,
    @Request() request,
  ): Promise<LoginResponseType> {
    return this.service.validateLongTokenLogin(
      loginDto,
      request,
      request.headers['x_device_id'],
    );
  }

  @AllowFirstLogin()
  @ApiBearerAuth()
  @Post('logout')
  @OperatorRole()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  public async logout(@Request() request): Promise<void> {
    await this.service.logout(
      {
        sessionId: request.user.sessionId,
      },
      request,
    );
  }

  @AllowFirstLogin()
  @SkipMasking()
  @UseInterceptors(UserBasedCacheInterceptor)
  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Get('me')
  @OperatorRole()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  // @CacheKeyWithUser('get-me-api')
  public me(
    @Request() request,
  ): Promise<NullableType<User> | NullableType<any>> {
    return this.service.me(request.user);
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('me')
  @OperatorRole()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Request() request,
    @Body() userDto: AuthUpdateDto,
  ): Promise<any> {
    const i18n = I18nContext.current();
    await this.service.update(request.user, userDto);
    const isSuccess = i18n?.t('success.user.updated');
    return { message: isSuccess };
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('change/password')
  @OperatorRole()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  changePassword(
    @Request() request,
    @Body() changePasswordDto: AuthChangePasswordDto,
  ): Promise<void> {
    return this.service.changePassword(request.user, changePasswordDto);
  }
}

@ApiTags('Client Auth')
@Controller({
  path: 'client/auth',
  version: '1',
})
export class ClientAuthController {
  constructor(private readonly service: AuthService) {}
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('email/login')
  @ApiHeaders([{ name: 'x_device_id', schema: { type: 'string' } }])
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: AuthEmailLoginDto,
    @Request() request,
  ): Promise<LoginResponseType> {
    if (loginDto.isOperator === true) {
      throw new ForbiddenException(`You're not authorized`);
    }
    return this.service.validateLogin(
      loginDto,
      request,
      request.headers['x_device_id'],
    );
  }

  @ApiBearerAuth()
  @Post('logout')
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  public async logout(@Request() request): Promise<void> {
    await this.service.logout(
      {
        sessionId: request.user.sessionId,
      },
      request,
    );
  }

  @AllowFirstLogin()
  @SkipMasking()
  @UseInterceptors(UserBasedCacheInterceptor)
  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Get('me')
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  @CacheKeyWithUser('get-me-api')
  public me(
    @Request() request,
  ): Promise<NullableType<User> | NullableType<any>> {
    return this.service.me(request.user);
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('me')
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Request() request,
    @Body() userDto: AuthUpdateDto,
  ): Promise<any> {
    const i18n = I18nContext.current();
    await this.service.update(request.user, userDto);
    const isSuccess = i18n?.t('success.user.updated');
    return { message: isSuccess };
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('change/password')
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  changePassword(
    @Request() request,
    @Body() changePasswordDto: AuthChangePasswordDto,
  ): Promise<void> {
    return this.service.changePassword(request.user, changePasswordDto);
  }
}

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly mailerService: MailerService,
    private readonly leadsService: LeadsService,
    private readonly otpService: OtpService,
    private readonly clientsService: ClientsService,
  ) {}

  //to be removed
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('email/login')
  @ApiHeaders([{ name: 'x_device_id', schema: { type: 'string' } }])
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: AuthEmailLoginDto,
    @Request() request,
  ): Promise<LoginResponseType> {
    return this.service.validateLogin(
      loginDto,
      request,
      request.headers['x_device_id'],
    );
  }

  @Post('email/exists')
  @HttpCode(HttpStatus.OK)
  async emailExists(@Body() emailExistsDto: AuthEmailExistsDto): Promise<any> {
    const exists = await this.service.emailExists(emailExistsDto);
    return { exists };
  }

  @Post('email/isLeadExists')
  @HttpCode(HttpStatus.OK)
  async emailExistsForLead(
    @Body() emailExistsDto: AuthEmailExistsDto,
  ): Promise<any> {
    const exists = await this.leadsService.IsLeadExistByEmail(emailExistsDto);
    return { exists };
  }

  @ApiBody({
    isArray: true,
    type: UserAnswersDTO,
  })
  @ApiBearerAuth()
  @Post('answers')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async userKycAnswers(
    @Request() req,
    @Body() userAnswerDTO: UserAnswersDTO[],
  ): Promise<any> {
    return await this.service.userKycAnswersOptimized(req, userAnswerDTO);
  }

  @ApiBearerAuth()
  @Get('answers')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getUserKycAnswers(@Request() req): Promise<any> {
    return await this.service.getUserKycAnswersById(req);
  }

  @Post('email/register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() createUserDto: AuthRegisterLoginDto,
    @Query() query?: AuthRegisterQueryDto,
  ): Promise<any> {
    const { otpId, email } = createUserDto;
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
    return this.service.register(createUserDto, query);
  }

  @Post('email/register/broker')
  @HttpCode(HttpStatus.CREATED)
  async registerBroker(
    @Body() createUserDto: AuthRegisterBrokerDto,
  ): Promise<any> {
    return this.service.registerBroker(createUserDto);
  }

  @Post('email/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<void> {
    return this.service.confirmEmail(confirmEmailDto.hash);
  }

  @ApiHeaders([{ name: 'x_custom_lang', schema: { default: 'en' } }])
  @Post('forgot/password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: AuthForgotPasswordDto) {
    return await this.service.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset/password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto): Promise<void> {
    return this.service.resetPassword(
      resetPasswordDto.hash,
      resetPasswordDto.password,
      resetPasswordDto.otp,
    );
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('change/password')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  changePassword(
    @Request() request,
    @Body() changePasswordDto: AuthChangePasswordDto,
  ): Promise<void> {
    return this.service.changePassword(request.user, changePasswordDto);
  }

  @AllowFirstLogin()
  @SkipMasking()
  @UseInterceptors(UserBasedCacheInterceptor)
  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @CacheKeyWithUser('get-me-api')
  public me(
    @Request() request,
  ): Promise<NullableType<User> | NullableType<any>> {
    return this.service.me(request.user);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @ApiBearerAuth()
  @Get('messages')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getMessages(@Query() query: MessageDto, @Request() request) {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;

    if (limit > 50) {
      limit = 50;
    }
    const data = await this.service.getMessages({
      userId: request.user.id,
      paginationOptions: {
        page,
        limit,
      },
      leadId: query?.leadId,
      opportunityId: query?.opportunityId,
      send: query?.send ?? true,
    });
    const { hasNextPage, messages, ...remainingData } = data;
    const updatedMessages = await Promise.all(
      messages.map(async (message) => {
        if (message.operatorId) {
          const operatorDetail = await this.service.getOperatorDetail(
            message.operatorId,
          );
          message.sentBy = operatorDetail?.full_name || null;
        }
        return message;
      }),
    );
    return {
      data: { messages: updatedMessages, ...remainingData },
      hasNextPage,
    };
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public refresh(@Request() request): Promise<Omit<LoginResponseType, 'user'>> {
    return this.service.refreshToken({
      sessionId: request.user.sessionId,
    });
  }

  @AllowFirstLogin()
  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async logout(@Request() request): Promise<void> {
    await this.service.logout(
      {
        sessionId: request.user.sessionId,
      },
      request,
    );
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async update(
    @Request() request,
    @Body() userDto: AuthUpdateDto,
  ): Promise<any> {
    const i18n = I18nContext.current();
    await this.service.update(request.user, userDto);
    const isSuccess = i18n?.t('success.user.updated');
    return { message: isSuccess };
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('completed-steps')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async updateSteps(
    @GetUser() user: User,
    @Body() stepsUpdateDto: StepsUpdateDto,
  ): Promise<any> {
    return this.service.updateSteps(user.id, stepsUpdateDto);
  }

  @ApiBearerAuth()
  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async delete(@Request() request): Promise<void> {
    return this.service.softDelete(request.user);
  }

  @ApiBearerAuth()
  @Patch('notifications-settings')
  @UseGuards(AuthGuard('jwt'))
  public async settings(
    @Request() request,
    @Body() notificationsSettingsDto: NotificationsSettingsDto,
  ): Promise<any> {
    return await this.service.toggleNotification(
      request.user,
      notificationsSettingsDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('message/mark-read/:id')
  @HttpCode(HttpStatus.OK)
  async markMessageAsRead(
    @Param() markReadDto: MarkMessageAsReadDto,
    @GetUser() user: User,
  ) {
    return await this.mailerService.markMessageAsRead({
      userId: user?.id,
      id: +markReadDto.id,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/message-details')
  @HttpCode(HttpStatus.OK)
  async getMessage(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<any> {
    const i18n = I18nContext.current();
    try {
      const message = await this.mailerService.getOneMessage({ id });
      const error = i18n?.t('errors.auth.messageNotFound');
      if (message.userId !== user.id) throw new ForbiddenException(error);
      return message;
    } catch (error) {
      console.error('Error getting message:', error);
      return error.response;
    }
  }

  @Get('user-agreements/:uuid')
  @HttpCode(HttpStatus.OK)
  async getUserAgreements(@Param('uuid') uuid: string): Promise<any> {
    try {
      const userAgreements = await this.service.getUserAgreements(uuid);
      return userAgreements;
    } catch (error) {
      console.error('Error getting message:', error);
      return error.response;
    }
  }
  @Post('/register-leads')
  create(@Body() createLeadDto: CreateLeadDto) {
    createLeadDto.source = 'Website';
    return this.leadsService.create(createLeadDto);
  }
  @Post('zapier-webhook-leads')
  async handleZapierWebhook(@Body() data: CreateLeadDto) {
    try {
      // Process the data received from Zapier
      await this.service.zapierDataFormatting(data);

      return { message: 'Data received and processed successfully' };
    } catch (error) {
      console.error('======error======', error);
      if (error.response) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: {
            msg: 'Failed to process Zapier data',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('zapier-zoom-meeting-attend')
  @HttpCode(HttpStatus.OK)
  async handleZapierZoomMeetingWebhook(
    @Body() data: ZoomParticipantDto,
  ): Promise<{ message: string }> {
    try {
      console.log('zapier payload for meeting', data);
      await this.service.zapierZoomMeetingParticipant(data);
      return { message: 'Data received and processed successfully' };
    } catch (error) {
      console.error('Error processing Zoom participant:', error);

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Failed to process Zapier data',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('find-by-email')
  async findUserByEmail(@Body() loginDto: AuthEmailExistsDto2) {
    return this.service.findUserByEmail(loginDto.email, loginDto.password);
  }

  @Post('verify-2fa-token-by-email')
  @HttpCode(HttpStatus.OK)
  async verify2FATokenByEmail(@Body() tokenDTO: TokenByEmailDTO): Promise<any> {
    const isTokenValid = await this.clientsService.verify2FATokenByEmail(
      tokenDTO.email,
      tokenDTO.token,
    );
    if (!isTokenValid) {
      throw new NotFoundException('Invalid token');
    }

    return { message: 'Token verified successfully' };
  }

  @Post('verify-forgot-password-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtpForgotPassword(
    @Body() otpDTO: AuthForgotPasswordOtpDto,
  ): Promise<any> {
    return await this.service.verifyForgotPasswordOtp(otpDTO.otp, otpDTO.email);
  }

  @Post('save-fcm-token')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async saveFcmToken(
    @Body() body: SaveFcmTokenDto,
    @Request() request,
  ): Promise<any> {
    return await this.service.saveFcmToken(
      request.user.sessionId,
      body.fcmToken,
      request.headers['x_device_id'],
    );
  }
}
