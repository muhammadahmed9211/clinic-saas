import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerSeedService } from './server-seed.service';
import { Server } from 'src/wallet/entities/server.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Server])],
  providers: [ServerSeedService],
  exports: [ServerSeedService],
})
export class ServerSeedModule {}
