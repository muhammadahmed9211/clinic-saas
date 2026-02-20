import { Throttle } from '@nestjs/throttler';

// Custom throttling decorators for different use cases
export const StrictThrottle = () => Throttle({ default: { limit: 2, ttl: 60000 } }); // 2 requests per minute
export const ModerateThrottle = () => Throttle({ default: { limit: 10, ttl: 60000 } }); // 10 requests per minute
export const LightThrottle = () => Throttle({ default: { limit: 30, ttl: 60000 } }); // 30 requests per minute

// Custom throttling for specific time windows
export const HourlyThrottle = (limit: number) => Throttle({ default: { limit, ttl: 3600000 } }); // per hour
export const DailyThrottle = (limit: number) => Throttle({ default: { limit, ttl: 86400000 } }); // per day

// IP-based throttling (more restrictive)
export const IPThrottle = (limit: number, ttl: number) => Throttle({ 
  default: { limit, ttl },
  // You can add custom key generator here if needed
});
