import { Module } from '@nestjs/common';
import { FreshDeskController } from './fresh-desk.controller';
import { FreshDeskService } from './fresh-desk.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import {FreshDeskLogs} from 'src/fresh-desk/entities/freshdesk-logs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,FreshDeskLogs])],
  controllers: [FreshDeskController],
  providers: [FreshDeskService],
})
export class FreshDeskModule {}
