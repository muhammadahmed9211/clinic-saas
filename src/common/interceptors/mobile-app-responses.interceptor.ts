import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MobileResponseStatus } from 'src/utils/enums/mobile-reponse-status.enum';

export interface MobileAppResponse<T> {
  status: number;
  statusCode: number;
  message: string;
  result: T;
}

interface ResponseWithStatusText {
  status: number;
  statusCode: number;
  statusText: string;
  result: any;
}

@Injectable()
export class MobileAppInterceptor<T>
  implements NestInterceptor<T, MobileAppResponse<T>>
{
  private isMobileAppResponse(
    data: any,
  ): data is MobileAppResponse<T> | ResponseWithStatusText {
    return (
      data &&
      typeof data === 'object' &&
      'status' in data &&
      'statusCode' in data &&
      ('message' in data || 'statusText' in data) &&
      'result' in data
    );
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();
    const channelId = request.headers['x-channel-id'];

    return next.handle().pipe(
      map((data) => {
        // If not mobile channel, return original response
        if (channelId !== '002') {
          return data;
        }

        // If the data is already a Promise, resolve it first
        if (data instanceof Promise) {
          return data.then((resolvedData) => {
            if (this.isMobileAppResponse(resolvedData)) {
              return this.convertToMobileResponse(resolvedData);
            }
            return this.transformToMobileResponse(
              resolvedData,
              response.statusCode,
            );
          });
        }

        // If data is already in correct format, handle statusText conversion
        if (this.isMobileAppResponse(data)) {
          return this.convertToMobileResponse(data);
        }

        // Transform the data
        return this.transformToMobileResponse(data, response.statusCode);
      }),
    );
  }

  private convertToMobileResponse(
    data: MobileAppResponse<T> | ResponseWithStatusText,
  ): MobileAppResponse<T> {
    if ('statusText' in data) {
      return {
        status: data.status,
        statusCode: data.statusCode,
        message: data.statusText,
        result: data.result,
      };
    }
    return data;
  }

  private transformToMobileResponse(
    data: any,
    statusCode: number,
  ): MobileAppResponse<T> {
    statusCode = statusCode || HttpStatus.OK;
    let responseMessage = HttpStatus[statusCode];

    if (data && typeof data === 'object') {
      const dataObj = data as Record<string, any>;
      if ('statusText' in dataObj && typeof dataObj.statusText === 'string') {
        responseMessage = dataObj.statusText;
      } else if ('message' in dataObj && typeof dataObj.message === 'string') {
        responseMessage = dataObj.message;
      }
    }

    return {
      status: MobileResponseStatus.SUCCESS,
      statusCode: statusCode,
      message: responseMessage,
      result: Array.isArray(data) ? { data } : data,
    };
  }
}
