import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { PartnerType } from 'src/admin/custom-dropdown/custom-dropdown/entities/partner-type.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([PartnerType])],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
