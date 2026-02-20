import { Global, Module } from '@nestjs/common';
import { ListCacheService } from './list-cache-service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListName } from 'src/list-item/entities/list-name.entity';
import { ListViewsFilter } from 'src/list-views-filter/entities/list-views-filter.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ListName, ListViewsFilter])],
  providers: [ListCacheService],
  exports: [ListCacheService],
})
export class ListCacheModule {}
