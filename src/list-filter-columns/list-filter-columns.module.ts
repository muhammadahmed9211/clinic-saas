import { Module } from '@nestjs/common';
import { ListFilterColumnsService } from './list-filter-columns.service';
import { ListFilterColumnsController } from './list-filter-columns.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListColumnFilter } from './entities/list-filter-column.entity';
import { ListViewColumnsModule } from '../list-view-columns/list-view-columns.module';
import { ListColumnsMetaModule } from 'src/list-columns-meta/list-columns-meta.module';
import { ListViewsFilterModule } from 'src/list-views-filter/list-views-filter.module';
import { ListFilterColumnsRepository } from './repositories/list-filter-columns.repository';
import { ListActivityLogsModule } from 'src/list-activity-logs/list-activity-logs.module';
@Module({
  imports: [
    ListViewColumnsModule,
    ListColumnsMetaModule,
    ListViewsFilterModule,
    ListActivityLogsModule,
    TypeOrmModule.forFeature([ListColumnFilter]),
  ],
  controllers: [ListFilterColumnsController],
  providers: [ListFilterColumnsRepository, ListFilterColumnsService],
})
export class ListFilterColumnsModule {}
