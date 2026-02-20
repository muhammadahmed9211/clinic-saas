import { CacheKey } from '@nestjs/cache-manager';

export const CacheKeyWithUser = (key: string): MethodDecorator => {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      // Access the request object from method arguments (typically the first argument)
      const request = args[0];
      const userId = request?.user?.id;

      if (userId) {
        // Dynamically generate the cache key
        const dynamicCacheKey = `${key}-${userId}`;

        // Manually apply the CacheKey decorator with the dynamic cache key
        CacheKey(dynamicCacheKey)(target, propertyKey, descriptor);
      }

      // Call the original method
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
};
