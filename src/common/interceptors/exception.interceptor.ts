import {
  Logger,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nValidationException, I18nService } from 'nestjs-i18n';

export enum ErrorMessages {
  'Internal Server Error' = 'We encountered an unexpected error. We apologize for the inconvenience. Please try again shortly.',
}

type ErrorMessage = ErrorMessages | string;

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly i18n: I18nService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    console.log('Exception: ', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: ErrorMessage = ErrorMessages['Internal Server Error'];
    let errorDetails;
    let stack;

    // Handle I18nValidationException specifically
    if (exception instanceof I18nValidationException) {
      status = HttpStatus.BAD_REQUEST;
      const validationErrors = exception.errors;
      const ctx = host.switchToHttp();
      const request = ctx.getRequest<Request>();

      // Get the first error message and details
      const formattedError = await this.formatI18nValidationErrors(
        validationErrors,
        request,
      );
      message = formattedError.message as ErrorMessage;
      errorDetails = formattedError.details;
    }
    // Handle other HTTP exceptions
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;
      console.log('exceptionResponse: ', exceptionResponse);
      message = this.getErrorMessage(exception);
      errorDetails = exceptionResponse?.errorDetails || null;
    }

    console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
    if (process.env.NODE_ENV !== 'production' && exception instanceof Error) {
      stack = exception.stack;
    }

    this.logger.error(
      `Error ReqUrl: ${request.url} Status: ${status} Message: ${message}`,
      stack,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      ...(errorDetails && { errorDetails }),
      ...(stack && { stack }),
    });
  }

  private async formatI18nValidationErrors(
    errors: any[],
    request: Request,
  ): Promise<{ message: string; details: Record<string, string> }> {
    const errorDetails: Record<string, string> = {};
    let firstMessage: string | null = null;

    // Process all errors and extract translated messages
    for (const error of errors) {
      if (error.constraints && Object.keys(error.constraints).length > 0) {
        const property = error.property;
        // Get the first constraint value (should already be translated by I18nValidationException)
        let constraint = Object.values(error.constraints)[0] as string;

        // Handle case where constraint might be a function or not properly resolved
        if (typeof constraint === 'function') {
          try {
            constraint = (constraint as () => string)();
          } catch (e) {
            // If function call fails, skip this error
            continue;
          }
        }

        // If message contains i18n key pattern (validation.KEY|...), resolve it
        if (typeof constraint === 'string' && constraint.includes('validation.')) {
          // Extract the key part before the pipe
          const keyMatch = constraint.match(/^validation\.([^|]+)/);
          if (keyMatch) {
            const translationKey = `validation.${keyMatch[1]}`;
            try {
              // Get language from request headers or default to 'en'
              const acceptLanguage = request.headers['accept-language'];
              const lang = acceptLanguage?.split(',')[0]?.split('-')[0] || 'en';
              
              // Resolve the translation using I18nService
              const translated = await this.i18n.translate(translationKey, {
                lang,
                args: { property },
              });
              if (translated && typeof translated === 'string' && !translated.includes('validation.')) {
                constraint = translated;
              }
            } catch (e) {
              // If translation fails, use the key without serialized data
              constraint = constraint.split('|')[0];
            }
          } else {
            // Clean up the message if it contains serialized data
            constraint = constraint.split('|')[0];
          }
        }

        errorDetails[property] = constraint;

        if (!firstMessage) {
          firstMessage = constraint;
        }
      }
    }

    if (!firstMessage) {
      return {
        message: 'Validation failed',
        details: {},
      };
    }

    return {
      message: firstMessage,
      details: errorDetails,
    };
  }

  private getErrorMessage(exception: HttpException): ErrorMessage {
    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'object') {
      if ((exceptionResponse as any).error) {
        const message =
          (exceptionResponse as any).error.message ??
          (exceptionResponse as any).error.msg;
        if (message) return message;
      }

      const exceptionMessage =
        (exceptionResponse as any).message ?? (exceptionResponse as any).msg;

      if (
        typeof exceptionMessage === 'string' &&
        ErrorMessages[exceptionMessage as keyof typeof ErrorMessages]
      ) {
        return ErrorMessages[exceptionMessage as keyof typeof ErrorMessages];
      }

      return exceptionMessage;
    }

    return ErrorMessages['Internal Server Error'];
  }
}

//  ======================= FATIMA WORK =======================
// import {
//   Logger,
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';
// import { Request, Response } from 'express';

// export enum ErrorMessages {
//   'Internal Server Error' = 'We encountered an unexpected error. We apologize for the inconvenience. Please try again shortly.',
// }

// @Catch()
// export class GlobalExceptionFilter implements ExceptionFilter {
//   private readonly logger = new Logger(GlobalExceptionFilter.name);

//   catch(exception: unknown, host: ArgumentsHost) {
//     console.log('Exception: ', exception);
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//     let status = HttpStatus.INTERNAL_SERVER_ERROR;
//     let message: any = ErrorMessages['Internal Server Error']; // Default to user-friendly message
//     let errorDetails;
//     let stack;
//     console.log('ticky and tally ka filter');
//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       const exceptionResponse = exception.getResponse() as any;
//       console.log('exceptionResponse: ', exceptionResponse);
//       message = this.getErrorMessage(exception);
//       errorDetails = exceptionResponse?.errorDetails || null;
//     }

//     console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
//     if (process.env.NODE_ENV !== 'production' && exception instanceof Error) {
//       stack = exception.stack;
//     }

//     this.logger.error(
//       `Error ReqUrl: ${request.url} Status: ${status} Message: ${message}`,
//       JSON.stringify(stack),
//     );

//     response.status(status).json({
//       statusCode: status,
//       timestamp: new Date().toISOString(),
//       path: request.url,
//       message,
//       ...(errorDetails && { errorDetails }), // Add errorDetails,
//       ...(stack && { stack }), // Include stack trace if available
//     });
//   }

//   private getErrorMessage(exception: HttpException): string {
//     const exceptionResponse = exception.getResponse();
//     let message;
//     if (typeof exceptionResponse === 'object') {
//       if (exceptionResponse['error']) {
//         message =
//           exceptionResponse['error']['message'] ??
//           exceptionResponse['error']['msg'];
//       }
//       const exceptionMessage =
//         exceptionResponse['message'] ?? exceptionResponse['msg'];
//       if (ErrorMessages[exceptionMessage] || ErrorMessages[message]) {
//         return ErrorMessages[exceptionMessage] ?? ErrorMessages[message];
//       }
//       return exceptionMessage ?? message;
//     }
//     return ErrorMessages['Internal Server Error'];
//   }
// }
