import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AllConfigType } from 'src/config/config.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServiceAuthGuard implements CanActivate {
  constructor(    private configService: ConfigService<AllConfigType>,) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const serviceSecretKey = this.configService.get('auth.ticketServiceSecret', {
        infer: true,
    });
    const headerSecretKey = request.headers['ticket-service-secret'];
    if (!headerSecretKey || headerSecretKey !== serviceSecretKey) {
      throw new UnauthorizedException('Invalid service authentication');
    }
    return true;
  }
}