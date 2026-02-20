import { IsNumber } from 'class-validator';

export class GetAccountLoginsDto {
  @IsNumber()
  client: number;
}
