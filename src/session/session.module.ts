import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { SessionService } from './session.service';
import { OperatorSession } from './entities/operator_session.entity';
import { DeviceInfo } from 'src/push-notification/entities/device-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session, OperatorSession, DeviceInfo])],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
