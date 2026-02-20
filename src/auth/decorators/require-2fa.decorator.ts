import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to mark routes that require 2FA verification.
 * Use this decorator on endpoints that should only be accessible to users with 2FA verified tokens.
 * 
 * @example
 * ```typescript
 * @Require2FA()
 * @UseGuards(AuthGuard('jwt'), TwoFactorVerificationGuard)
 * @Get('sensitive-data')
 * getSensitiveData() {
 *   // Only users with 2FA verified tokens can access this
 * }
 * ```
 */
export const REQUIRE_2FA_KEY = 'require2FA';
export const Require2FA = () => SetMetadata(REQUIRE_2FA_KEY, true);

