/**
 * JWT MT5 Strategy
 * Validates JWT tokens issued for MT5 account authentication
 * Created: October 24, 2025
 */

import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { OrNeverType } from '../../utils/types/or-never.type';
import { JwtPayloadType } from './types/jwt-payload.type';

@Injectable()
export class JwtMt5Strategy extends PassportStrategy(Strategy, 'jwt-mt5') {
  constructor(configService: ConfigService<AllConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.secret', { infer: true }),
    });
  }

  public validate(payload: JwtPayloadType): OrNeverType<JwtPayloadType> {
    // Ensure this is an MT5 authentication token
    if (!payload.mt5Login) {
      throw new UnauthorizedException('Invalid MT5 token');
    }

    return payload;
  }
}
