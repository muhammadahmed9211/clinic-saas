import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from 'src/events/entities/active-log.entity';
import { ActiveLogController } from './active-log.controller';
import { ActiveLogService } from './active-log.service';
import { ActivityLogType } from 'src/events/entities/active-log-type.entity';
import { UserLog } from 'src/events/entities/user-log.entity';
import { User } from 'src/users/entities/user.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ActivityLog,
      ActivityLogType,
      UserLog,
      User,
      Transaction,
    ]),
  ],
  controllers: [ActiveLogController],
  providers: [ActiveLogService],
  exports:[ActiveLogService]
})
export class ActiveLogModule {}
