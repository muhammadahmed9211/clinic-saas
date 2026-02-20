import { Module } from '@nestjs/common';
import { ListActivityLogsService } from './list-activity-logs.service';

@Module({
  providers: [ListActivityLogsService],
  exports:[ListActivityLogsService]
})
export class ListActivityLogsModule {}
