import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiHeaders, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';

@ApiTags('Settings')
@Controller({
  path: 'settings',
  version: '1',
})
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}
  @ApiHeaders([
    { name: 'x_custom_lang', schema: { type: 'string', default: 'en' } },
  ])
  @Get('country-iso')
  @HttpCode(HttpStatus.OK)
  getStats() {
    return this.settingsService.getCountriesIso();
  }

  @Get('partner-type')
  @HttpCode(HttpStatus.OK)
  getSettings() {
    return this.settingsService.getSettings();
  }
}
