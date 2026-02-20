import { Module } from '@nestjs/common';
import { ListViewColumnsService } from './list-view-columns.service';
import { ListViewColumnsController } from './list-view-columns.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListViewColumn } from './entities/list-view-column.entity';
import { ListViewsFilterModule } from 'src/list-views-filter/list-views-filter.module';
import { ListColumnsMetaModule } from 'src/list-columns-meta/list-columns-meta.module';
import { ListActivityLogsModule } from 'src/list-activity-logs/list-activity-logs.module';

@Module({
  imports: [
    ListViewsFilterModule,
    ListColumnsMetaModule,
    ListActivityLogsModule,
    TypeOrmModule.forFeature([ListViewColumn]),
  ],
  controllers: [ListViewColumnsController],
  providers: [ListViewColumnsService],
  exports: [ListViewColumnsService],
})
export class ListViewColumnsModule {}
