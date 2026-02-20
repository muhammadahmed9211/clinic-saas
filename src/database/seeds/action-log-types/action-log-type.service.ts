import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityLogType } from 'src/events/entities/active-log-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActionLogTypeSeedService {
  constructor(
    @InjectRepository(ActivityLogType)
    private activityTypeRepository: Repository<ActivityLogType>,
    // @InjectRepository(ActiveLogEntityType)
    // private entityTypeRepository: Repository<ActiveLogEntityType>,
    // @InjectRepository(ActiveLogPerformerType)
    // private performerTypeRepository: Repository<ActiveLogPerformerType>,
  ) {}

  async run() {
    const isExistActionType = await this.activityTypeRepository.count();

    const actionTypeData = [
      {
        type: 'ActivityLogAction',
        key: 0,
        value: 'DetailsUpdated',
      },
      {
        type: 'ActivityLogAction',
        key: 1,
        value: 'RecordCreated',
      },
      {
        type: 'ActivityLogAction',
        key: 2,
        value: 'RecordDeleted',
      },
      {
        type: 'ActivityLogAction',
        key: 3,
        value: 'NoteAdded',
      },
      {
        type: 'ActivityLogAction',
        key: 4,
        value: 'PasswordChanged',
      },
      {
        type: 'ActivityLogAction',
        key: 5,
        value: 'DeviceAdded',
      },
      {
        type: 'ActivityLogAction',
        key: 6,
        value: 'Stub',
      },
      {
        type: 'ActivityLogAction',
        key: 7,
        value: 'RecordDownloaded',
      },
      {
        type: 'ActivityLogEntityType',
        key: 0,
        value: 'User',
      },
      {
        type: 'ActivityLogEntityType',
        key: 1,
        value: 'BrokerUser',
      },
      {
        type: 'ActivityLogEntityType',
        key: 2,
        value: 'Operator',
      },
      {
        type: 'ActivityLogEntityType',
        key: 3,
        value: 'KycDocument',
      },
      {
        type: 'ActivityLogEntityType',
        key: 4,
        value: 'Transaction',
      },
      {
        type: 'ActivityLogEntityType',
        key: 5,
        value: 'Affiliate',
      },
      {
        type: 'ActivityLogEntityType',
        key: 6,
        value: 'Callback',
      },
      {
        type: 'ActivityLogEntityType',
        key: 7,
        value: 'BrokerBanking',
      },
      {
        type: 'ActivityLogEntityType',
        key: 8,
        value: 'Broker',
      },
      {
        type: 'ActivityLogEntityType',
        key: 9,
        value: 'BrokerCountry',
      },
      {
        type: 'ActivityLogEntityType',
        key: 10,
        value: 'Office',
      },
      {
        type: 'ActivityLogEntityType',
        key: 11,
        value: 'CommunicationIntegration',
      },
      {
        type: 'ActivityLogEntityType',
        key: 12,
        value: 'Template',
      },
      {
        type: 'ActivityLogEntityType',
        key: 13,
        value: 'EventCommunicationTypeRel',
      },
      {
        type: 'ActivityLogEntityType',
        key: 14,
        value: 'CommunicationParameter',
      },
      {
        type: 'ActivityLogEntityType',
        key: 15,
        value: 'TransactionLimits',
      },
      {
        type: 'ActivityLogEntityType',
        key: 16,
        value: 'Role',
      },
      {
        type: 'ActivityLogEntityType',
        key: 17,
        value: 'AffiliateBanking',
      },
      {
        type: 'ActivityLogEntityType',
        key: 18,
        value: 'App',
      },
      {
        type: 'ActivityLogEntityType',
        key: 19,
        value: 'DeskStatusRerouteRule',
      },
      {
        type: 'ActivityLogEntityType',
        key: 20,
        value: 'NinjaRule',
      },
      {
        type: 'ActivityLogEntityType',
        key: 21,
        value: 'MenuItem',
      },
      {
        type: 'ActivityLogEntityType',
        key: 22,
        value: 'DeskRule',
      },
      {
        type: 'ActivityLogEntityType',
        key: 23,
        value: 'CrmApiToken',
      },
      {
        type: 'ActivityLogEntityType',
        key: 24,
        value: 'AffiliatePayout',
      },
      {
        type: 'ActivityLogEntityType',
        key: 25,
        value: 'WebAsset',
      },
      {
        type: 'ActivityLogEntityType',
        key: 26,
        value: 'NinjaParameter',
      },
      {
        type: 'ActivityLogEntityType',
        key: 27,
        value: 'Parameter',
      },
      {
        type: 'ActivityLogEntityType',
        key: 28,
        value: 'Psp',
      },
      {
        type: 'ActivityLogEntityType',
        key: 29,
        value: 'UserBanking',
      },
      {
        type: 'ActivityLogEntityType',
        key: 30,
        value: 'TranslationKeyLang',
      },
      {
        type: 'ActivityLogEntityType',
        key: 31,
        value: 'TranslationKey',
      },
      {
        type: 'ActivityLogEntityType',
        key: 32,
        value: 'UserSiteLinksView',
      },
      {
        type: 'ActivityLogEntityType',
        key: 33,
        value: 'PspRule',
      },
      {
        type: 'ActivityLogEntityType',
        key: 34,
        value: 'ContentLink',
      },
      {
        type: 'ActivityLogEntityType',
        key: 35,
        value: 'UserSitePspsView',
      },
      {
        type: 'ActivityLogEntityType',
        key: 36,
        value: 'Credit',
      },
      {
        type: 'ActivityLogEntityType',
        key: 37,
        value: 'AdvertiserPayment',
      },
      {
        type: 'ActivityLogEntityType',
        key: 38,
        value: 'Advertiser',
      },
      {
        type: 'ActivityLogPerformerType',
        key: 0,
        value: 'User',
      },
      {
        type: 'ActivityLogPerformerType',
        key: 1,
        value: 'Operator',
      },
      {
        type: 'ActivityLogPerformerType',
        key: 2,
        value: 'System',
      },
      {
        type: 'ActivityLogPerformerType',
        key: 3,
        value: 'CrmAPI',
      },
      {
        type: 'ActivityLogTriggerType',
        key: 0,
        value: 'Default',
      },
      {
        type: 'ActivityLogTriggerType',
        key: 1,
        value: 'NinjaCall',
      },
      {
        type: 'ActivityLogTriggerType',
        key: 2,
        value: 'Callback',
      },
      {
        type: 'ActivityLogTriggerType',
        key: 3,
        value: 'Upload',
      },
      {
        type: 'ActivityLogTriggerType',
        key: 4,
        value: 'Promote',
      },
      {
        type: 'ActivityLogTriggerType',
        key: 5,
        value: 'CA',
      },
    ];

    if (isExistActionType == 0) {
      await this.activityTypeRepository.save(actionTypeData);
    }
  }
}
