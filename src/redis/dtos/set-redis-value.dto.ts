export class SetRedisValueDto {
  key: string;
  value: string;
  ttl?: number;
}
