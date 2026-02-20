import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { Mt5HttpService } from './mt5-http.service';

@Module({
  imports: [HttpModule],
  providers: [Mt5HttpService],
  exports: [Mt5HttpService],
})
export class Mt5HttpModule {}
