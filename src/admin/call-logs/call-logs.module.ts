import { Module } from '@nestjs/common';
import { CallLogsService } from './call-logs.service';
import { CallLogsController } from './call-logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallLog } from './entities/call-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CallLog])],
  controllers: [CallLogsController],
  providers: [CallLogsService],
  exports: [CallLogsService],
})
export class CallLogsModule {}
