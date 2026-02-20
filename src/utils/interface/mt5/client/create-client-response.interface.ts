import { IBaseResponse } from '../base-response.interface';

interface IClientCreate {
  retcode: string;
  answer: {
    id: number;
    retcode: string;
  }[];
}

export interface IClientCreateResponse extends IBaseResponse<IClientCreate> {}
