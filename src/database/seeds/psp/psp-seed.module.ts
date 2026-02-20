import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PspSeedService } from './psp-seed.service';
import { PSP } from 'src/transaction/entities/psp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PSP])],
  providers: [PspSeedService],
  exports: [PspSeedService],
})
export class PspSeedModule {}
