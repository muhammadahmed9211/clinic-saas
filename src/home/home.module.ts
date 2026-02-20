import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { ConfigModule } from '@nestjs/config';
import { LeadsRepository } from 'src/admin/leads/repositories/lead.repository';
import { HttpModule } from '@nestjs/axios';
import { IbProfileModule } from 'src/ib/ib_profile/ib_profile.module';

@Module({
  imports: [ConfigModule, HttpModule, IbProfileModule],
  controllers: [HomeController],
  providers: [HomeService, LeadsRepository],
})
export class HomeModule {}
