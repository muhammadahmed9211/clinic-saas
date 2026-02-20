import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MaskDataService } from 'src/roles/maskData/maskData.service';
import { Reflector } from '@nestjs/core';
import { SKIP_MASKING_KEY } from '../decorators/skip-masking.decorator';

@Injectable()
export class RoleBasedMaskingInterceptor implements NestInterceptor {
  constructor(
    private maskDataService: MaskDataService,
    private reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const skipMasking = this.reflector.get<boolean>(
      SKIP_MASKING_KEY,
      context.getHandler(),
    );

    if (skipMasking) {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest();
    const userId = req.user?.id;

    return next.handle().pipe(
      map(async (data) => {
        return await this.maskDataService.maskData(data, userId);
      }),
    );
  }
}
