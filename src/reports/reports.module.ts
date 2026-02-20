import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ReportsRepository } from './repositories/reports.repository';
import { LeadsModule } from 'src/admin/leads/leads.module';
import { FilesModule } from 'src/files/files.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Partner } from 'src/settings/entities/partner.entity';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';

@Module({
  imports: [LeadsModule,FilesModule,TypeOrmModule.forFeature([User,Partner,Mt5Account])],
  controllers: [ReportsController],
  providers: [ReportsService, ReportsRepository],
})
export class ReportsModule {}
