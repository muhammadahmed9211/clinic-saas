import { Module } from '@nestjs/common';
import { TradingGroupService } from './trading-group.service';
import { TradingGroupController } from './trading-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradingGroup } from './entities/trading-group.entity';
import { Server } from 'src/wallet/entities/server.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TradingGroup, Server])],
  controllers: [TradingGroupController],
  providers: [TradingGroupService],
  exports: [TradingGroupService],
})
export class TradingGroupModule {}
