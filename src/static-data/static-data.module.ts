import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticDataController } from './static-data.controller';
import { StaticDataService } from './static-data.service';
import { StaticData } from './entities/static-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StaticData])],
  controllers: [StaticDataController],
  providers: [StaticDataService],
})
export class StaticDataModule {}
