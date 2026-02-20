import { MessagePattern } from '@nestjs/microservices';
import 'dotenv/config';

export const MessagePatternWithPrefix = (pattern: string): MethodDecorator => {
  const patternWithPrefix = `${process.env.ENVIRONMENT}.restapi.${pattern}`;
  console.log('lisetening', patternWithPrefix);
  // const patternWithPrefix = `${secrets.KAFKA_CONSUMER_PREFIX}.${pattern}`;
  return MessagePattern(patternWithPrefix);
};
