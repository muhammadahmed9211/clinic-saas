import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { HeartBeatService } from 'src/heart-beat/heart-beat.service';
import { RoleEnum } from 'src/roles/roles.enum';
// import { PrivilegeService } from 'src/privileges/privileges.service';

@Injectable()
export class PrivilegeMiddleware implements NestMiddleware {
  constructor(private readonly heartbeatService: HeartBeatService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // const findEndpoints = await this.permissionEndpointService.getByEndpoint(
    //   req.originalUrl,
    // );

    // console.log('0000000000000', findEndpoints);

    // if (findEndpoints) {
    //   const authHeader = req.headers['authorization'];
    //   if (!authHeader) {
    //     throw new UnauthorizedException('Authorization header not found');
    //   }

    //   const token = authHeader.split(' ')[1];
    //   if (!token) {
    //     throw new UnauthorizedException('Token not provided');
    //   }

    //   const secretKey = process.env.AUTH_JWT_SECRET;
    //   if (!secretKey) {
    //     throw new Error('JWT secret key not found in environment variables');
    //   }

    //   const decodedToken = jwt.verify(token, secretKey) as IToken;
    //   if (!decodedToken) {
    //     throw new UnauthorizedException('Invalid token');
    //   }

    //   const roleId = decodedToken.role.id;
    //   const endpoint = req.originalUrl;
    //   const method = req.method;

    //   const original = res.send;

    //   res.send = function (body) {
    //     // Log the response body here
    //     console.log(`Response Body: ${JSON.stringify(body)}`);
    //     return original.call(this, body); // Ensure to return the response object
    //   };

    //   try {
    //     const hasAccess = await this.permissionEndpointService.hasAccess(
    //       roleId,
    //       method,
    //       endpoint,
    //     );
    //     if (!hasAccess) {
    //       throw new UnauthorizedException('Unauthorized access');
    //     }
    //     next();
    //   } catch (error) {
    //     throw new UnauthorizedException('Unauthorized access');
    //   }
    // }

    const jwtService = new JwtService();

    if (req.headers.authorization) {
      const user = await jwtService.decode(
        req?.headers?.authorization?.split(' ')[1],
      );
      if (user?.role?.id === RoleEnum.client) {
        const session = await this.heartbeatService.updateHeartbeat({
          userId: user?.id,
        });
        console.log(session);
      }
    }

    const originalSend = res.send.bind(res);

    res.send = (body: any) => {
      // Once response is ready to send, check status code
      if (
        res.statusCode >= 200 &&
        res.statusCode < 300 &&
        req.method !== 'GET'
      ) {
        // Log request details including the token from headers
        // console.log('Request URL:', req.originalUrl);
        // console.log('Request Method:', req.method);
        // console.log(
        //   'Authorization Token:',
        //   req.headers.authorization || 'No Authorization Token',
        // );
        // Log response details
        // console.log('Status Code:', res.statusCode);
        // console.log('Response Body:', body);
      }

      // Continue with the original send function
      return originalSend(body);
    };

    next();
  }
}
