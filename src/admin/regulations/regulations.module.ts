import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicRegulationController, RegulationController } from './regulations.controller';
import { RegulationService } from './regulations.service';
import { Regulations } from './entities/regulations.entity';;
import { Client } from 'src/users/entities/client.entity';
import { RegulationTranslations } from './entities/regulations-translation.entity';
import { RegulationsCountries } from './entities/regulations-countries.entity';
import { RegulationBlockedCountries } from './entities/regulation-blocked-countries.entity';
import { RegulationsRepository } from './repositories/regulations.repository';
import { FilesModule } from 'src/files/files.module';
import { SettingsModule } from 'src/settings/settings.module';
import { User } from 'src/users/entities/user.entity';
import { DemoModule } from 'src/crm-website/demo/demo.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Regulations, RegulationTranslations, RegulationsCountries, RegulationBlockedCountries, Client, User]),
    FilesModule,
    SettingsModule,
    DemoModule
  ],
  controllers: [RegulationController, PublicRegulationController],
  providers: [RegulationService, RegulationsRepository],
  exports: [],
})
export class RegulationsModule { }
