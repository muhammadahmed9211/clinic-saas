import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListMetaDataSeedService } from './list-meta-data.seed.service';
import { ListName } from 'src/list-item/entities/list-name.entity';
import { ListColumnsGroup } from 'src/list-columns-group/entities/list-columns-group.entity';
import { ListColumnsMeta } from 'src/list-columns-meta/entities/list-columns-meta.entity';
import { ListViewsFilter } from 'src/list-views-filter/entities/list-views-filter.entity';
import { ListItemModule } from 'src/list-item/list-item.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    ListItemModule,
    TypeOrmModule.forFeature([
      ListName,
      ListColumnsGroup,
      ListColumnsMeta,
      ListViewsFilter,
      User,
    ]),
  ],
  providers: [ListMetaDataSeedService],
  exports: [ListMetaDataSeedService],
})
export class ListMetaDataSeedModule {}
