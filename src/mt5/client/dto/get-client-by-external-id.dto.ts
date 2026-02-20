import { IsNotEmpty } from 'class-validator';

export class GetClientByExternalIdDto {
  @IsNotEmpty()
  externalId: string;
}
