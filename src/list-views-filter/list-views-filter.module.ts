import { Module } from '@nestjs/common';
import { ListViewsFilterService } from './list-views-filter.service';
import { ListViewsFilterController } from './list-views-filter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListViewsFilter } from './entities/list-views-filter.entity';
import { ListItemModule } from 'src/list-item/list-item.module';
import { ListActivityLogsModule } from 'src/list-activity-logs/list-activity-logs.module';

@Module({
  imports: [ListItemModule, TypeOrmModule.forFeature([ListViewsFilter]) , ListActivityLogsModule],
  controllers: [ListViewsFilterController],
  providers: [ListViewsFilterService],
  exports: [ListViewsFilterService],
})
export class ListViewsFilterModule {}
