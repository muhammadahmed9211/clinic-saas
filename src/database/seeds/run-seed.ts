import { NestFactory } from '@nestjs/core';
import { titlesSeedService } from './add-notification-titles/add-notification-titles-seed.service';
import { addNotificationsSeedService } from './add-notifications/add-notifications-seed.service';
import { CreateKycStatusArabicTranslationsSeedService } from './create-kyc-status-arabic-translations/create-kyc-status-arabic-translations-seed.service';
import { CreateRejectedReasonsSeedService } from './create-rejected-reasons/create-rejected-reasons-seed.service';
import { CreateSalesRetentionInfoSeedService } from './create-sales-retention-info/create-sales-retention-info-seed.service';
import { CreateRequiredKYCDocumentsTableSeedService } from './create-required-kyc-documents-table/create-required-kyc-documents-table-seed.service';
import { RoleSeedService } from './role/role-seed.service';
import { SeedModule } from './seed.module';
import { StatusSeedService } from './status/status-seed.service';
import { UserSeedService } from './user/user-seed.service';
import { PartnerListSeedService } from './partner-list/create-partner-list-seed.service';
import { ServerSeedService } from './server/server-seed.service';
// import { PrivilegeSeedService } from './privileges/privilege.seed.service';
import { SettingDropDownSeedService } from './setting-dropDown/setting-dropdown.service';
import { OperatorSeedService } from './operator/operator.service';
import { PspSeedService } from './psp/psp-seed.service';
import { TransactionMethodService } from './transaction-method/transaction-method.service';
import { MasterTaskSeedService } from './master-task/masterTask.service';
import { ActionLogTypeSeedService } from './action-log-types/action-log-type.service';
import { TaskSeedService } from './task/task.service';
import { RolePermissionServiceSeed } from './role-permission/role-permission.service';
import { PermissionEndpointSeedService } from './permission_endpoint/permission_endpoint.service';
import { PartnerGroupsService } from './partner-groups/partner-groups.service';
import { TradingGroupsService } from './trading-groups/trading-groups.service';
import { ListMetaDataSeedService } from './list-meta-data/list-meta-data.seed.service';
import { PartnerSeedService } from './partner/partner.service';
import { FunnelSeedService } from './funnel/funnel.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(RoleSeedService).run();
  await app.get(StatusSeedService).run();
  await app.get(UserSeedService).run();

  await app.get(CreateRequiredKYCDocumentsTableSeedService).run();

  await app.get(PartnerListSeedService).run();
  await app.get(ServerSeedService).run();

  // await app.get(PrivilegeSeedService).run();
  await app.get(CreateSalesRetentionInfoSeedService).run();
  await app.get(SettingDropDownSeedService).run();

  await app.get(OperatorSeedService).run();

  await app.get(PartnerSeedService).run();

  await app.get(PspSeedService).run();

  await app.get(TransactionMethodService).run();
  await app.get(MasterTaskSeedService).run();

  await app.get(CreateRejectedReasonsSeedService).run();
  await app.get(ActionLogTypeSeedService).run();

  await app.get(CreateKycStatusArabicTranslationsSeedService).run();

  await app.get(TaskSeedService).run();
  await app.get(RolePermissionServiceSeed).run();

  await app.get(PermissionEndpointSeedService).run();

  await app.get(PartnerGroupsService).run();

  await app.get(addNotificationsSeedService).run();

  await app.get(titlesSeedService).run();

  await app.get(TradingGroupsService).run();

  await app.get(ListMetaDataSeedService).run();

  await app.get(FunnelSeedService).run();

  await app.close();
};

void runSeed();
