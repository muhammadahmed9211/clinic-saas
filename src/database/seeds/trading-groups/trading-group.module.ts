import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradingGroup } from 'src/trading-group/entities/trading-group.entity';
import { Server } from 'src/wallet/entities/server.entity';
import { TradingGroupsService } from './trading-groups.service';

@Module({
  imports: [TypeOrmModule.forFeature([TradingGroup, Server])],
  providers: [TradingGroupsService],
  exports: [TradingGroupsService],
})
export class TradingGroupsModule {}
