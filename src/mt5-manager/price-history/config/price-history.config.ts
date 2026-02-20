/**
 * Price History Config
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 *
 * Import Updates:
 * - validateConfig: src/common/utils → src/utils/validate-config (may need adjustment)
 */

import { registerAs } from '@nestjs/config';
import { IsString, IsOptional } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { PriceHistoryConfig } from './price-history.config-type';

class EnvironmentVariablesValidator {
  @IsOptional()
  @IsString()
  SUPPORTED_RESOLUTIONS: string;

  @IsOptional()
  @IsString()
  SUPPORTS_GROUP_REQUEST: string;

  @IsOptional()
  @IsString()
  SUPPORTS_MARKS: string;

  @IsOptional()
  @IsString()
  SUPPORTS_SEARCH: string;

  @IsOptional()
  @IsString()
  SUPPORTS_TIMESCALE_MARKS: string;
}

export default registerAs<PriceHistoryConfig>('priceHistory', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    supportedResolutions: process.env.SUPPORTED_RESOLUTIONS
      ? process.env.SUPPORTED_RESOLUTIONS.split(',')
      : ['1', '5', '15', '30', '60', 'D'],
    supportsGroupRequest: process.env.SUPPORTS_GROUP_REQUEST === 'true',
    supportsMarks: process.env.SUPPORTS_MARKS === 'true',
    supportsSearch: process.env.SUPPORTS_SEARCH === 'true',
    supportsTimescaleMarks: process.env.SUPPORTS_TIMESCALE_MARKS === 'true',
  };
});
