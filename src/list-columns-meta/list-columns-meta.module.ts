import { Module } from '@nestjs/common';
import { ListColumnsMetaService } from './list-columns-meta.service';
import { ListColumnsMetaController } from './list-columns-meta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListColumnsMeta } from './entities/list-columns-meta.entity';
import { ListColumnsGroupModule } from 'src/list-columns-group/list-columns-group.module';

@Module({
  imports: [
    ListColumnsGroupModule,
    TypeOrmModule.forFeature([ListColumnsMeta]),
  ],
  // controllers: [ListColumnsMetaController],
  providers: [ListColumnsMetaService],
  exports: [ListColumnsMetaService],
})
export class ListColumnsMetaModule {}
