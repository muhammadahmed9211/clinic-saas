import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to mark routes that are accessible during operator's first login.
 * Use this decorator on endpoints that operators should be able to access 
 * even when isFirstLogin is false (e.g., change password, update profile, logout).
 * 
 * @example
 * ```typescript
 * @AllowFirstLogin()
 * @UseGuards(AuthGuard('jwt'))
 * @Patch('change/password')
 * changePassword() {
 *   // Operators can access this even on first login
 * }
 * ```
 */
export const ALLOW_FIRST_LOGIN_KEY = 'allowFirstLogin';
export const AllowFirstLogin = () => SetMetadata(ALLOW_FIRST_LOGIN_KEY, true);

