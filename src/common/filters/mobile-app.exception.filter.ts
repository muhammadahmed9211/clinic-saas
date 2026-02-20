import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MobileResponseStatus } from 'src/utils/enums/mobile-reponse-status.enum';

@Catch()
export class MobileAppExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();

    const channelId = request.headers['x-channel-id'];

    if (channelId !== '002') {
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      return response
        .status(status)
        .json(
          exception instanceof HttpException
            ? exception.getResponse()
            : { message: 'Internal server error' },
        );
    }

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, any>;
        if ('message' in responseObj) {
          message = Array.isArray(responseObj.message)
            ? responseObj.message[0]
            : String(responseObj.message);
        }
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
    }

    response.status(statusCode).json({
      status: MobileResponseStatus.FAILED,
      statusCode: statusCode,
      message: message,
      result: null,
    });
  }
}
