/**
 * Route Cache Interceptor
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 * Source: mt5-rest-api/src/common/interceptors/route-cache.interceptor.ts
 */

import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RouteCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    return `price-history:${JSON.stringify(request.query)}`;
  }
}

