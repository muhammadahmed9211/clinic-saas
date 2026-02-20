import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { TradingGroup } from 'src/trading-group/entities/trading-group.entity';
import { Server, ServerName } from 'src/wallet/entities/server.entity';
import { AllConfigType } from 'src/config/config.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TradingGroupsService {
  constructor(
    @InjectRepository(TradingGroup)
    private readonly tradingGroupRepository: Repository<TradingGroup>,
    @InjectRepository(Server)
    private readonly serverRepository: Repository<Server>,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async run() {
    const count = await this.tradingGroupRepository.count();
    const servers = await this.serverRepository.find();

    if (count === 0) {
      const tradingGroupData: DeepPartial<TradingGroup>[] = [
        {
          name: this.configService.getOrThrow('app.defaultLiveGroup', {
            infer: true,
          }),
          server: servers.find((item) => item.name === ServerName.LIVE),
        },
        {
          name: this.configService.getOrThrow('app.defaultDemoGroup', {
            infer: true,
          }),
          server: servers.find((item) => item.name === ServerName.DEMO),
        },
      ];

      for (const item of tradingGroupData) {
        await this.tradingGroupRepository.save(
          this.tradingGroupRepository.create(item),
        );
      }
    }
  }
}
