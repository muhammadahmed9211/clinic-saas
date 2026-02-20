import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funnel } from 'src/admin/leads/opportunity/entities/funnel.entity';
import { FunnelSeedService } from './funnel.service';

@Module({
  imports: [TypeOrmModule.forFeature([Funnel])],
  providers: [FunnelSeedService],
  exports: [FunnelSeedService],
})
export class FunnelSeedModule {}
