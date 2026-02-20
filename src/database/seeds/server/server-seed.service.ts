import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Server,
  ServerName,
  ServerType,
} from 'src/wallet/entities/server.entity';

@Injectable()
export class ServerSeedService {
  constructor(
    @InjectRepository(Server)
    private repository: Repository<Server>,
  ) {}

  async run() {
    const isExist = await this.repository.count();
    if (!isExist) {
      const servers = [
        {
          name: ServerName.WALLET,
          type: ServerType.SYSTEM,
        },
        {
          name: ServerName.DEMO,
          type: ServerType.MT5,
        },
        {
          name: ServerName.LIVE,
          type: ServerType.MT5,
        },
      ];
      const allServers: Server[] = [];

      for (const server of servers) {
        const newServer = this.repository.create(server);
        allServers.push(newServer);
      }

      await this.repository.save(allServers);
    }
  }
}
