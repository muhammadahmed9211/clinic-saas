import { ExecutionContext, Injectable } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Injectable()
export class UserBasedCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    if (userId) {
      const dynamicKey = `get-me-api-${userId}`;
      return dynamicKey;
    }

    return super.trackBy(context);
  }
}
