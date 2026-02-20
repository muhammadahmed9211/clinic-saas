import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from 'src/config/app.config';
import databaseConfig from 'src/database/config/database.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmConfigService } from '../typeorm-config.service';
import { RoleSeedModule } from './role/role-seed.module';
import { StatusSeedModule } from './status/status-seed.module';
import { UserSeedModule } from './user/user-seed.module';

import { CreateRequiredKYCDocumentsTableSeedModule } from './create-required-kyc-documents-table/create-required-kyc-documents-table-seed.module';
import { PartnerListSeedModule } from './partner-list/create-partner-list-seed.module';
import { ServerSeedModule } from './server/server-seed.module';
import { PrivilegeSeedModule } from './privileges/privilege.seed.module';
import { settingDropDownModule } from './setting-dropDown/setting-dropdown.module';

import { CreateSalesRetentionInfoSeedModule } from './create-sales-retention-info/create-sales-retention-info-seed.module';
import { OperatorSeedModule } from './operator/operator.module';
import { PspSeedModule } from './psp/psp-seed.module';
import { TransactionMethodModule } from './transaction-method/transaction-method.module';
import { MasterTaskSeedModule } from './master-task/masterTask.module';

import { CreateRejectedReasonsSeedModule } from './create-rejected-reasons/create-rejected-reasons-seed.module';
import { ActionLogTypeModule } from './action-log-types/action-log-type.module';

import { CreateKycStatusArabicTranslationsSeedModule } from './create-kyc-status-arabic-translations/create-kyc-status-arabic-translations-seed.module';
import { TaskSeedModule } from './task/task.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { PermissionEndpointSeedModule } from './permission_endpoint/permission_endpoint.module';
import { PartnerGroupsModule } from './partner-groups/partner-groups.module';

import { addNotificationsSeedModule } from './add-notifications/add-notifications-seed.module';

import { titlesSeedModule } from './add-notification-titles/add-notification-titles-seed.module';
import { TradingGroupsModule } from './trading-groups/trading-group.module';
import { ListMetaDataSeedModule } from './list-meta-data/list-meta-data.seed.module';
import { PartnerSeedModule } from './partner/partner.module';
import { FunnelSeedModule } from './funnel/funnel.module';

@Module({
  imports: [
    titlesSeedModule,
    addNotificationsSeedModule,
    CreateKycStatusArabicTranslationsSeedModule,
    CreateRejectedReasonsSeedModule,
    CreateSalesRetentionInfoSeedModule,
    CreateRequiredKYCDocumentsTableSeedModule,
    RoleSeedModule,
    StatusSeedModule,
    UserSeedModule,
    PartnerListSeedModule,
    PrivilegeSeedModule,
    ServerSeedModule,
    settingDropDownModule,
    OperatorSeedModule,
    PspSeedModule,
    TransactionMethodModule,
    MasterTaskSeedModule,
    ActionLogTypeModule,
    TaskSeedModule,
    RolePermissionModule,
    PermissionEndpointSeedModule,
    PartnerSeedModule,
    FunnelSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    PartnerGroupsModule,
    TradingGroupsModule,
    ListMetaDataSeedModule,
  ],
})
export class SeedModule {}
