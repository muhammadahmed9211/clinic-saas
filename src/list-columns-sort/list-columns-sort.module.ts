import { Module } from '@nestjs/common';
import { ListColumnsSortService } from './list-columns-sort.service';
import { ListColumnsSortController } from './list-columns-sort.controller';
import { ListColumnsMetaModule } from 'src/list-columns-meta/list-columns-meta.module';
import { ListViewsFilterModule } from 'src/list-views-filter/list-views-filter.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListColumnsSort } from './entities/list-columns-sort.entity';
import { ListColumnsSortRepository } from './respositories/list-columns-sort.repository';
@Module({
  imports: [
    ListColumnsMetaModule,
    ListViewsFilterModule,
    TypeOrmModule.forFeature([ListColumnsSort]),
  ],
  // controllers: [ListColumnsSortController],
  providers: [ListColumnsSortRepository, ListColumnsSortService],
})
export class ListColumnsSortModule {}
