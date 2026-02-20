import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { AuthGoogleService } from './auth-google.service';
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto';
import { SocialLoginResponseType } from '../auth/types/login-response.type';

@ApiTags('Auth')
@Controller({
  path: 'auth/google',
  version: '1',
})
export class AuthGoogleController {
  constructor(
    private readonly authService: AuthService,
    private readonly authGoogleService: AuthGoogleService,
  ) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Google login for existing users' })
  @ApiBody({ type: AuthGoogleLoginDto })
  async login(
    @Body() loginDto: AuthGoogleLoginDto,
    @Request() req: any,
  ): Promise<SocialLoginResponseType> {
    const source = req.headers['x-source'];
    const language = req.headers['x_custom_lang']?.toUpperCase();
    const socialData = await this.authGoogleService.getProfileByToken(loginDto);

    const isEmailExists = await this.authService.emailExists({
      email: socialData.email || '',
    });

    if (isEmailExists) {
      const user = await this.authService.validateSocialLoginOnly('google', socialData);
      console.log('Login user: ', user);
      return user;
    }

    const user = await this.authService.validateSocialSignup(
      'google', 
      socialData, 
      source,
      language,
      loginDto.searchParams
    );
    console.log('Register user: ', user);
    return user;
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Google signup for new users' })
  @ApiBody({ type: AuthGoogleLoginDto })
  async signup(
    @Body() signupDto: AuthGoogleLoginDto,
    @Request() req: any,
  ): Promise<SocialLoginResponseType> {
    const source = req.headers['x-source'];
    const language = req.headers['x_custom_lang']?.toUpperCase();
    const socialData = await this.authGoogleService.getProfileByToken(signupDto);

    return this.authService.validateSocialSignup(
      'google', 
      socialData, 
      source,
      language,
      signupDto.searchParams
    );
  }
}
