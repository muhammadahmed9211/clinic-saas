import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ALLOW_FIRST_LOGIN_KEY } from '../decorators/allow-first-login.decorator';
import { REQUIRE_2FA_KEY } from '../decorators/require-2fa.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwoFactorVerificationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return true;
    }

    const handler = context.getHandler();
    const controllerClass = context.getClass();

    let allowFirstLogin = this.reflector.getAllAndOverride<boolean>(
      ALLOW_FIRST_LOGIN_KEY,
      [handler, controllerClass],
    );

    let allow2FA = this.reflector.getAllAndOverride<boolean>(REQUIRE_2FA_KEY, [
      handler,
      controllerClass,
    ]);

    const bypass2faVerification = this.configService.get(
      'app.bypass2faVerification',
      { infer: true },
    );
    if (bypass2faVerification === 'true' || bypass2faVerification === true) {
      return true;
    }

    if (user?.operator) {
      if (user.operator.isFirstLogin === true && !allowFirstLogin) {
        throw new ForbiddenException(
          'You must complete your first login setup. Please update your password and profile before accessing other resources.',
        );
      }

      if (!user.operator.is2FAVerified && !allow2FA) {
        throw new UnauthorizedException(
          '2FA verification is required for operators to access this resource. Please verify your 2FA token.',
        );
      }
    }

    const require2FA = this.reflector.getAllAndOverride<boolean>('require2FA', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (require2FA && !user?.operator) {
      if (!user?.is2FAVerified) {
        throw new UnauthorizedException(
          '2FA verification is required to access this resource. Please verify your 2FA token.',
        );
      }
    }

    return true;
  }
}
