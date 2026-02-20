import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MainClient } from 'binance';
import { AllConfigType } from 'src/config/config.type';
@Injectable()
export class BinanceService implements OnModuleInit {
  private binance: MainClient;
  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  onModuleInit() {
    const api_key = this.configService.getOrThrow('binance.apiKey', {
      infer: true,
    });
    const api_secret = this.configService.getOrThrow('binance.apiSecret', {
      infer: true,
    });
    const client = new MainClient({
      api_key,
      api_secret,
    });
    this.binance = client;
  }

  async getDepositAddress(coin: string) {
    const coinNetworks = this.configService.getOrThrow('binance.networks', {
      infer: true,
    });
    const networks: {
      network: string;
      tag: string;
      address: string;
      coin: string;
      url: string;
    }[] = [];
    for (const network of coinNetworks) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const address = await this.binance.getDepositAddress({ coin, network });
        if (address) {
          networks.push({ ...address, network });
        }
      } catch (error) {
        console.log(error);
      }
    }
    return {
      coin,
      networks,
    };
  }
}
