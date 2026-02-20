import { HttpStatus } from 'aws-sdk/clients/lambda';
import { Status } from 'src/utils/enums/mt5/response-status.enum';
export interface IBaseResponse<T> {
  status: number;
  statusCode: number;
  message: string;
  result: T;
}

type Result<T> = {
  retcode: string;
  answer: T;
};

export interface IResponseWrapper<T> {
  status: Status;
  statusCode: number;
  message: string;
  result: Result<T> | any;
}
export class ResponseWrapper {
  static wrap<T>(response: {
    status: Status;
    statusCode: HttpStatus;
    statusText: string;
    data: T | any;
  }): IResponseWrapper<T> {
    return {
      status: response.status,
      statusCode: response.statusCode,
      message: response.statusText,
      result: response.data,
    };
  }

  static wrapDefault<T>(response: T | any): IResponseWrapper<T> {
    return {
      status: Status.SUCCESS,
      statusCode: response.status ?? 200,
      message: response.statusText ?? 'OK',
      result: response.data ?? response,
    };
  }

  static wrapError<T>(error: any): IResponseWrapper<T> {
    return {
      status: Status.FAILED,
      statusCode: error.response?.status || 500,
      message: error.message || 'Internal Server Error',
      result: null,
    };
  }

  static unwrap<T>(wrapper: IResponseWrapper<T>): Result<T> | null {
    if (wrapper.status === Status.SUCCESS) {
      return wrapper.result;
    } else {
      return null;
    }
  }

  static unwrapDeep<T>(wrapper: IResponseWrapper<T>): T | null {
    if (wrapper.status === Status.SUCCESS && wrapper.result.answer) {
      console.log('statement true');
      return wrapper.result.answer;
    } else if (wrapper.status === Status.SUCCESS && wrapper.result) {
      return wrapper.result;
    } else {
      return null;
    }
  }
}
