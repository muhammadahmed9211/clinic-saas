import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { AuthAppleService } from './auth-apple.service';
import { AuthAppleLoginDto } from './dto/auth-apple-login.dto';
import { SocialLoginResponseType } from '../auth/types/login-response.type';

@ApiTags('Auth')
@Controller({
  path: 'auth/apple',
  version: '1',
})
export class AuthAppleController {
  constructor(
    private readonly authService: AuthService,
    private readonly authAppleService: AuthAppleService,
  ) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Apple login for existing users' })
  @ApiBody({ type: AuthAppleLoginDto })
  async login(
    @Body() loginDto: AuthAppleLoginDto,
    @Request() req: any,
  ): Promise<SocialLoginResponseType> {
    const source = req.headers['x-source']
    const language = req.headers['x_custom_lang']?.toUpperCase();
    const socialData = await this.authAppleService.getProfileByToken(loginDto);

    const isEmailExists = await this.authService.emailExists({
      email: socialData.email || '',
    });

    if (isEmailExists) {
      const user = await this.authService.validateSocialLoginOnly('apple', socialData);
      console.log('Login user: ', user);
      return user;
    }

    const user = await this.authService.validateSocialSignup('apple', socialData, source, language, loginDto.searchParams);
    console.log('Register user: ', user);
    return user;
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Apple signup for new users' })
  @ApiBody({ type: AuthAppleLoginDto })
  async signup(
    @Body() signupDto: AuthAppleLoginDto,
    @Request() req: any,
  ): Promise<SocialLoginResponseType> {
    const source = req.headers['x-source']
    const language = req.headers['x_custom_lang']?.toUpperCase();
    const socialData = await this.authAppleService.getProfileByToken(signupDto);

    return this.authService.validateSocialSignup('apple', socialData, source, language, signupDto.searchParams);
  }
}
