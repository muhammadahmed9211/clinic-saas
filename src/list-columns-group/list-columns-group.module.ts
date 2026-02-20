import { Module } from '@nestjs/common';
import { ListColumnsGroupService } from './list-columns-group.service';
import { ListColumnsGroupController } from './list-columns-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListColumnsGroup } from './entities/list-columns-group.entity';
import { ListItemModule } from 'src/list-item/list-item.module';

@Module({
  imports: [ListItemModule, TypeOrmModule.forFeature([ListColumnsGroup])],
  // controllers: [ListColumnsGroupController],
  providers: [ListColumnsGroupService],
  exports: [ListColumnsGroupService],
})
export class ListColumnsGroupModule {}
