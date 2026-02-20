import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RawBodyLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let raw = '';

    req.on('data', (chunk) => {
      raw += chunk;
    });

    req.on('end', () => {
      (req as any).rawBody = raw; // consistent name
      next();
    });
  }
}
