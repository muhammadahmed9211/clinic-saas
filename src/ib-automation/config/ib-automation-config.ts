import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { IBAutomationConfig } from './ib-automation-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  AGENT_TRADING_GROUP: string;
}

export default registerAs<IBAutomationConfig>('ibAutomationConfig', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    agentTradingGroup: process.env.AGENT_TRADING_GROUP,
  };
});
