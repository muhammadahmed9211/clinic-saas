import { registerAs } from '@nestjs/config';
import { BinanceConfig } from './binance-config.type';
import { IsArray, IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { Transform } from 'class-transformer';

class EnvironmentVariablesValidator {
  @IsString()
  BINANCEPAY_API_KEY: string;

  @IsString()
  BINANCEPAY_API_SECRET: string;

  @Transform(({ value }) => {
    try {
      const networks = JSON.parse(value);
      if (Array.isArray(networks) && networks.length > 0) {
        return networks;
      } else {
        throw new Error('Value is not an array');
      }
    } catch (error) {
      throw new Error('Invalid array format');
    }
  })
  @IsArray()
  BINANCE_COIN_LIST: string[];

  @Transform(({ value }) => {
    try {
      const networks = JSON.parse(value);
      if (Array.isArray(networks) && networks.length > 0) {
        return networks;
      } else {
        throw new Error('Value is not an array');
      }
    } catch (error) {
      throw new Error('Invalid array format');
    }
  })
  @IsArray()
  BINANCE_COIN_NETWORKS: string[];
}

export default registerAs<BinanceConfig>('binance', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);
  const coins = JSON.parse(process.env.BINANCE_COIN_LIST || `[]`);
  const networks = JSON.parse(process.env.BINANCE_COIN_NETWORKS || `[]`);

  return {
    apiKey: process.env.BINANCEPAY_API_KEY,
    apiSecret: process.env.BINANCEPAY_API_SECRET,
    coins,
    networks,
  };
});
