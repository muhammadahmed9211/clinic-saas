import { Module } from '@nestjs/common';
import { EconomicCalendarService } from './economic-calendar.service';
import { EconomicCalendarController } from './economic-calendar.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [EconomicCalendarService],
  controllers: [EconomicCalendarController]
})
export class EconomicCalendarModule {}
