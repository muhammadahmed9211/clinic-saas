import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionLogTypeSeedService } from './action-log-type.service';
import { ActivityLogType } from 'src/events/entities/active-log-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLogType])],
  providers: [ActionLogTypeSeedService],
  exports: [ActionLogTypeSeedService],
})
export class ActionLogTypeModule {}
