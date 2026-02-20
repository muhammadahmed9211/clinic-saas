import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';

@Injectable()
export class XMLParser implements NestMiddleware {
  constructor() {}

  use(req: Request, res: Response, next: NextFunction) {
    if (req.url.includes('/dpo/webhook')) {
      req.headers['content-type'] = 'application/xml';
    }
    if (req.is('application/xml')) {
      bodyParser.text({ type: 'application/xml' })(req, res, next);
    } else {
      next();
    }
  }
}
