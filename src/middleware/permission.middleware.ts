import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PermissionEndpointService } from 'src/permission_endpoint/permission_endpoint.service';
import * as jwt from 'jsonwebtoken';
import { IToken } from 'src/interface/token.interface';

@Injectable()
export class PermissionMiddleware implements NestMiddleware {
  constructor(
    private readonly permissionEndpointService: PermissionEndpointService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // const regex = /\d+/g;
    // const result = req.originalUrl.split('v1')[1]?.replace(regex, '{id}');

    // const uuidRegex =
    //   /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
    // const newUrl = req.originalUrl.replace(uuidRegex, '{id}');

    const uuidRegex =
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
    const numberRegex = /\b\d+\b/;
    const newUrl = req.originalUrl
      .split('v1')[1]
      ?.replace(uuidRegex, '{id}')
      .replace(numberRegex, '{id}');
    console.log(uuidRegex , "REGEX UUID")
    const result = newUrl?.split('?')[0];
    console.log('0000000000000', result);
    let findEndpoints;
    if (result) {
      findEndpoints = await this.permissionEndpointService.getByEndpoint(
        result,
        req.method,
      );
    }

    if (findEndpoints) {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        throw new UnauthorizedException('Authorization header not found');
      }

      // console.log('==============HEADERS', req);

      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token not provided');
      }

      const secretKey = process.env.AUTH_JWT_SECRET;
      if (!secretKey) {
        throw new Error('JWT secret key not found in environment variables');
      }

      const decodedToken = jwt.verify(token, secretKey) as IToken;
      if (!decodedToken) {
        throw new UnauthorizedException('Invalid token');
      }

      const roleId = decodedToken.role.id;
      if(!roleId){
        throw new UnauthorizedException("You don't have access")
      }
      const endpoint = result;
      const method = req.method;

      const original = res.send;

      res.send = function (body) {
        // Log the response body here
        console.log(`Response Body: ${JSON.stringify(body)}`);
        return original.call(this, body); // Ensure to return the response object
      };

      try {
        const hasAccess = await this.permissionEndpointService.hasAccess(
          roleId,
          method,
          endpoint,
        );
        if (!hasAccess) {
          throw new UnauthorizedException('Unauthorized access');
        }
        next();
      } catch (error) {
        throw new UnauthorizedException('Unauthorized access');
      }
    } else {
      next();
    }
  }
}
