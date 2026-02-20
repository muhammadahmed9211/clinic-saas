import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Ip,
  BadRequestException,
} from '@nestjs/common';
import { OtpService } from './otp.service';
import { ApiBearerAuth, ApiHeaders, ApiTags } from '@nestjs/swagger';
import { OtpSendDto } from './dto/otp-send.dto';
import { OtpVerifyDto } from './dto/otp-verify.dto';
import { SendOtpEmailDTO } from './dto/send_otp_email.dto';
import { VerifyOtpEmailDTO } from './dto/verify_otp_email.dto';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { ClientsService } from 'src/users/clients.service';
import { OtpTypes } from 'src/users/entities/otp.entity';
import { VerifyTransactionOtp } from './dto/verify_transaction_otp.dto';
import { SendOtpLoginEmailDTO } from './dto/send_otp_login_email.dto';
import { OtpVerifyLoginDto } from './dto/otp-verify-login.dto';

@ApiTags('Otp')
@Controller({
  path: 'otp',
  version: '1',
})
export class OtpController {
  constructor(
    private readonly otpService: OtpService,
    private readonly clientsService: ClientsService,
  ) {}

  @Post('send-mobile')
  @ApiHeaders([{ name: 'x_device_id', schema: { type: 'string' } }])
  async sendMobileOtp(
    @Body() otpSendDto: OtpSendDto,
    @Req() req: Request,
    @Ip() userIp: string,
  ): Promise<object> {
    const byPassRecaptcha =
      req.headers['x-channel-id'] && req.headers['x-channel-id'] === '002'
        ? true
        : false;
    return await this.otpService.sendMobileOtp(
      otpSendDto,
      req.headers['user-agent'],
      req.headers['x_device_id'],
      req.headers['x_custom_lang'],
      req.headers,
      userIp,
      byPassRecaptcha,
    );
  }

  @Post('verify-mobile')
  async verifyMobileOtp(@Body() otpDto: OtpVerifyDto): Promise<object> {
    return await this.otpService.verifyOtp(
      otpDto.id,
      otpDto.email,
      otpDto.telephonePrefix || '',
      otpDto.telephone || '',
      otpDto.code,
    );
  }

  @Post('send-email')
  @HttpCode(HttpStatus.OK)
  async sendEmailOtp(@Body() otpDto: SendOtpEmailDTO): Promise<any> {
    try {
      const result = await this.otpService.sendEmailOtp(otpDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Post('verify-email')
  async verifyEmailOtp(@Body() otpDto: VerifyOtpEmailDTO): Promise<any> {
    const result = await this.otpService.verifyEmailOtp(otpDto);
    return result;
  }
  @ApiBearerAuth()
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('send-transaction-otp')
  @HttpCode(HttpStatus.OK)
  async sendTransactionVerification(
    @GetUser() user: User,
    @Req() req: Request,
    @Ip() userIp: string,
  ): Promise<any> {
    const userData = await this.clientsService.findOne({
      id: user.id,
      status: { id: 1 },
    });
    if (userData?.email && userData.telephone && userData.telephonePrefix) {
      const data = {
        email: userData.email,
        telephone: userData.telephone,
        telephonePrefix: userData.telephonePrefix,
        type: OtpTypes.verify_transaction,
        recaptchaToken: 'N/A',
      };
      return await this.otpService.sendMobileOtpTransaction(
        data,
        req.headers['user-agent'],
        req.headers['x_device_id'],
        userIp,
        true,
      );
    }
  }
  @ApiBearerAuth()
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('verify-transaction-otp')
  async verifyTransactionVerification(
    @Body() otpDto: VerifyTransactionOtp,
    @GetUser() user: User,
  ): Promise<any> {
    const userData = await this.clientsService.findOne({
      id: user.id,
      status: { id: 1 },
    });
    if (userData?.telephone && userData?.telephonePrefix && userData.email) {
      return await this.otpService.verifyOtp(
        otpDto.id,
        userData.email,
        userData.telephonePrefix,
        userData.telephone,
        otpDto.otp,
        OtpTypes.verify_transaction,
      );
    }
  }

  @Post('send-login')
  @ApiHeaders([{ name: 'x_device_id', schema: { type: 'string' } }])
  async sendLoginOtp(
    @Body() otpSendDto: SendOtpLoginEmailDTO,
    @Req() req: Request,
    @Ip() userIp: string,
  ): Promise<object> {
    return await this.otpService.sendLoginOtp(
      otpSendDto,
      req.headers['x_device_id'],
      req.headers,
    );
  }

  @Post('verify-login')
  async verifyLoginOtp(@Body() otpDto: OtpVerifyLoginDto): Promise<object> {
    return await this.otpService.verifyLoginOtp(otpDto);
  }
   @ApiBearerAuth()
@Roles(RoleEnum.client)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Post('send-account-deletion-otp')
@HttpCode(HttpStatus.OK)
async sendAccountDeletionOtp(
  @GetUser() user: User,
  @Req() req: Request,
  @Ip() userIp: string,
): Promise<any> {
  const userData = await this.clientsService.findOne({
    id: user.id,
    status: { id: 1 },
  });

  if (userData?.email && userData.telephone && userData.telephonePrefix) {
    const data = {
      email: userData.email,
      telephone: userData.telephone,
      telephonePrefix: userData.telephonePrefix,
      type: OtpTypes.verify_account_deletion,
      recaptchaToken: 'N/A',
    };

    return await this.otpService.sendMobileOtpTransaction(
      data,
      req.headers['user-agent'],
      req.headers['x_device_id'],
      userIp,
      true, 
    );
  }
  throw new BadRequestException('User contact info not available.');
}

}
