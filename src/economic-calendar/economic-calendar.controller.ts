import { Controller, Get, Request, Query, UseGuards } from '@nestjs/common';
import { EconomicCalendarService } from './economic-calendar.service';
import { ApiBearerAuth, ApiHeaders, ApiQuery } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller({ path: 'economic-calendar', version: '1' })
export class EconomicCalendarController {
  constructor(private readonly calendarService: EconomicCalendarService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiHeaders([{ name: 'x_custom_lang', schema: { default: 'en' } }])
  @ApiQuery({ name: 'page', required: false, type: String, example: 1 })
  @ApiQuery({ name: 'size', required: false, type: String, example: 10 })
  @Get()
  async getEvents(
    @GetUser() user: User,
    @Query('filter') filter: 'yesterday' | 'today' | 'tomorrow' | 'week' = 'today',
    @Query('page') page = '1',
    @Query('size') size = '10',
    @I18n() i18n: I18nContext,
    @Request() req: any,
  ) {
    const userTimeZone = req.headers.user_time_zone;
    const id = user?.id;
    const language = i18n?.lang?.toLowerCase();
    return await this.calendarService.fetchEvents(filter, id, language, userTimeZone, size, page);
  }
}
