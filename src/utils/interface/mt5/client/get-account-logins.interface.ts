import { IBaseResponse } from '../base-response.interface';

interface IAccountLogins {
  retcode: string;
  answer: {
    string: number | number[];
  };
}

export interface IAccountLoginsResponse extends IBaseResponse<IAccountLogins> {}
