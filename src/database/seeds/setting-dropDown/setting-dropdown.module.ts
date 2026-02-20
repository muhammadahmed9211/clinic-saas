import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Desk } from 'src/admin/custom-dropdown/custom-dropdown/entities/desk.entity';
import { Office } from 'src/admin/custom-dropdown/custom-dropdown/entities/office.entity';
import { DeskType } from 'src/admin/custom-dropdown/custom-dropdown/entities/desk_type.entity';
import { SettingDropDownSeedService } from './setting-dropdown.service';

@Module({
  imports: [TypeOrmModule.forFeature([Desk, Office, DeskType])],
  providers: [SettingDropDownSeedService],
  exports: [SettingDropDownSeedService],
})
export class settingDropDownModule {}
