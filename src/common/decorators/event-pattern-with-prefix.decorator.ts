import { EventPattern } from '@nestjs/microservices';
import 'dotenv/config';

export const EventPatternWithPrefix = (pattern: string): MethodDecorator => {
  const patternWithPrefix = `${process.env.ENVIRONMENT}.restapi.${pattern}`;
  // const patternWithPrefix = `${secrets.KAFKA_CONSUMER_PREFIX}.${pattern}`;
  return EventPattern(patternWithPrefix);
};
