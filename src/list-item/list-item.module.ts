import { Module } from '@nestjs/common';
import { ListItemService } from './list-item.service';
import { ListItemController } from './list-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListName } from './entities/list-name.entity';
import { ListColumnsGroup } from 'src/list-columns-group/entities/list-columns-group.entity';
import { ListColumnsMeta } from 'src/list-columns-meta/entities/list-columns-meta.entity';
import { ListViewsFilter } from 'src/list-views-filter/entities/list-views-filter.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ListName,
      ListColumnsGroup,
      ListColumnsMeta,
      ListViewsFilter,
    ]),
  ],
  // controllers: [ListItemController],
  providers: [ListItemService],
  exports: [ListItemService],
})
export class ListItemModule {}
