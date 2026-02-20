import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.cotroller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/events.entity';
import { ActivityLog } from './entities/active-log.entity';
import { ActivityLogType } from './entities/active-log-type.entity';
import { UserLog } from './entities/user-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, ActivityLog, ActivityLogType, UserLog]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
