import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Always try to decode the JWT token if present
    // This populates request.user for authenticated requests
    // But doesn't throw errors for unauthenticated requests
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // If there's a token and it's valid, attach the user
    if (user) {
      return user;
    }

    // If no token or invalid token, just return null
    // Don't throw an error - let the route be accessible
    // The 2FA guard will handle authorization logic
    return null;
  }
}

