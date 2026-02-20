import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerListSeedService } from './create-partner-list-seed.service';
import { PartnerType } from 'src/admin/custom-dropdown/custom-dropdown/entities/partner-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PartnerType])],
  providers: [PartnerListSeedService],
  exports: [PartnerListSeedService],
})
export class PartnerListSeedModule {}
