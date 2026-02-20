import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpSocketClientService } from './http-socket-client.service';

@Module({
  imports: [HttpModule],
  providers: [HttpSocketClientService],
  exports: [HttpSocketClientService],
})
export class HttpSocketClientModule {}
