import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { SocialInterface } from '../social/interfaces/social.interface';
import { AuthAppleLoginDto } from './dto/auth-apple-login.dto';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class AuthAppleService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}

  async getProfileByToken(
    loginDto: AuthAppleLoginDto,
  ): Promise<SocialInterface> {
    const i18n = I18nContext.current();
    
    try {
      // Verify the ID token using Firebase Admin SDK
      const decodedToken = await this.firebaseAdmin
        .auth()
        .verifyIdToken(loginDto.idToken);

      if (!decodedToken) {
        const message = await i18n?.t('errors.auth.wrongToken');
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

      // Extract user information from the decoded token
      // Firebase tokens from Apple Sign-In may have 'name' (full name) or separate given_name/family_name
      const fullName = decodedToken.name || loginDto.firstName && loginDto.lastName 
        ? `${loginDto.firstName} ${loginDto.lastName}` 
        : '';
      const nameParts = fullName.split(' ').filter(part => part.length > 0);
      
      return {
        id: decodedToken.uid,
        email: decodedToken.email,
        firstName: decodedToken.given_name || loginDto.firstName || nameParts[0] || undefined,
        lastName: decodedToken.family_name || loginDto.lastName || nameParts.slice(1).join(' ') || undefined,
      };
    } catch (error) {
      const i18n = I18nContext.current();
      const message = await i18n?.t('errors.auth.wrongToken');
      
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message || 'Invalid token',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
