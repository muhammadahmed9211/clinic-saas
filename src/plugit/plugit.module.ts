import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PlugitService } from './plugit.service';
import { PlugitHttpService } from './http/plugit-http.service';

@Module({
  imports: [HttpModule],
  providers: [PlugitService, PlugitHttpService],
  exports: [PlugitService, PlugitHttpService],
})
export class PlugitModule {}
