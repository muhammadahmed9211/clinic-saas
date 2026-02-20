import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  FindOptionsWhere,
  Between,
  Equal,
  LessThanOrEqual,
  LessThan,
  MoreThan,
  MoreThanOrEqual,
  In,
  Not,
  FindOperator,
  FindOptionsOrder,
  EntityPropertyNotFoundError,
  QueryFailedError,
  DataSource,
  getMetadataArgsStorage,
  Like,
  IsNull,
} from 'typeorm';
import {
  FilterItem,
  FilterOperation,
  SortItem,
} from './dto/advance-search.dto';
import 'reflect-metadata';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { Client } from 'src/users/entities/client.entity';
import { user_kyc_documents } from 'src/user-kyc-docs/entities/user-kyc-documents.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { Partner } from 'src/settings/entities/partner.entity';
import { AdminTask } from 'src/admin/task/entities/task.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { AdvanceFilterMetaData } from './meta-data';
import { DataUpload } from 'src/users/entities/data_upload.entity';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import { Opportunity } from 'src/admin/leads/opportunity/entities/opportunity.entity';
import { LeadQuestion } from 'src/admin/questions/entities/question.entity';
import { AggregatorPSP } from 'src/aggregator/entities/aggregator.entity';
import { PSP } from 'src/transaction/entities/psp.entity';
import { LeadsCallLog } from 'src/admin/leads-call-logs/entities/leads-call-log.entity';
import { Meetings } from 'src/admin/leads/meetings/entities/meetings.entity';
import { notes } from 'src/admin/kyc/entities/kycNotes.entity';
import { Communication } from 'src/admin/client/entities/communication.entity';
import { InboxEmail } from 'src/mail/entities/inboxEmails.entity';
import { BankAccount } from 'src/admin/bank-account/entities/bank-account.entity';
import { Template } from 'src/mail/entities/template.entity';
import { Layout } from 'src/mail/entities/layout.entity';
import { Label } from 'src/tasks/entities/label.entity';
import { EmailEvent } from 'src/admin/email-mapping/entity/email-event.entity';
import { MasterTask } from 'src/tasks/entities/master_task.entity';
import { Regulations } from 'src/admin/regulations/entities/regulations.entity';
import { RegulationRule } from 'src/admin/regulations/regulations-config/entities/regulation-rule.entity';
import { RegulationEvent } from 'src/admin/regulations/regulations-config/entities/regulation-event.entity';
import { RegulationEventRuleMapping } from 'src/admin/regulations/regulations-config/entities/regulation-event-rule-mapping.entity';
import { NotificationMessages } from 'src/notification/entity/notification_messages.entity';
import { IbProfileRepository } from 'src/ib/ib_profile/repositories/ib_profile.repository';
import { IbCommissionProfile } from 'src/ib/ib_profile/entities/ib_commission_profile.entity';
import { IbCommissionProfileConfig } from 'src/ib/ib_config/entities/ib_commission_profile_config.entity';
import { AutomationConfig } from 'src/admin/automation/entities/automation-config.entity';
import { EventRegistration } from 'src/event-registraion/entities/event-registration.entity';

export const repositories = {
  [ListNames.USER_KYC_DOCUMENTS]: user_kyc_documents,
  [ListNames.OPERATOR]: Operator,
  [ListNames.PARTNER]: Partner,
  [ListNames.TASKS]: AdminTask,
  [ListNames.ROLE]: Role,
  [ListNames.TRANSACTIONS]: Transaction,
  [ListNames.CLIENTS]: Client,
  [ListNames.MT5_ACCOUNTS]: Mt5Account,
  [ListNames.PROCESS]: DataUpload,
  [ListNames.LEADS]: Lead,
  [ListNames.OPPORTUNITY]: Opportunity,
  [ListNames.LEAD_QUESTIONS]: LeadQuestion,
  [ListNames.AGGREGATOR]: AggregatorPSP,
  [ListNames.PSP]: PSP,
  [ListNames.LEADS_CALL_LOGS]: LeadsCallLog,
  [ListNames.MEETINGS]: Meetings,
  [ListNames.NOTES]: notes,
  [ListNames.EMAIL_INBOX]: InboxEmail,
  [ListNames.EMAIL_SENT_DRAFT]: Communication,
  [ListNames.COMPANY_BANK_ACCOUNT]: BankAccount,
  [ListNames.TEMPLATES]: Template,
  [ListNames.LAYOUT]: Layout,
  [ListNames.EMAIL_EVENTS]: EmailEvent,
  [ListNames.LABELS]: Label,
  [ListNames.MASTER_TASK]: MasterTask,
  [ListNames.REGULATION]: Regulations,
  [ListNames.REGULATION_RULE]: RegulationRule,
  [ListNames.REGULATION_EVENT]: RegulationEvent,
  [ListNames.REGULATION_EVENT_RULE]: RegulationEventRuleMapping,
  [ListNames.NOTIFICATION_MESSAGES]: NotificationMessages,
  [ListNames.IB_PROFILE]: IbCommissionProfile,
  [ListNames.IB_PROFILE_CONFIG]: IbCommissionProfileConfig,
  [ListNames.AUTOMATION_CONFIG]: AutomationConfig,
  [ListNames.EVENT_REGISTRATION]: EventRegistration,
};

export const byPassRepositories = {
  [ListNames.CLIENT_VOLUME_TARGET]: true,
  [ListNames.RETENTION_VOLUME_TARGET]: true,
  [ListNames.OPERATOR_PRODUCTIVITY]: true,
  [ListNames.SUB_IB_LEVEL_REPORT]: true,
  [ListNames.MT5_ACCOUNT_SUMMARY]: true,
  [ListNames.IB_COMMISSION]: true,
  [ListNames.IB_COMMISSION_CLIENT_DEALS_REPORT]: true,
  [ListNames.IB_COMMISSION_CLIENT_WISE_REPORT]: true,
  [ListNames.IB_COMMISSION_REPORT]: true,
};

export const listClientIdKeys = {
  [ListNames.TRANSACTIONS]: 'user.id',
  [ListNames.MT5_ACCOUNTS]: 'user.id',
  [ListNames.USER_KYC_DOCUMENTS]: 'user.id',
};

export const internalListingList = {
  [ListNames.CLIENT_VOLUME_TARGET]: true,
  [ListNames.RETENTION_VOLUME_TARGET]: true,
};

interface IGetAllRolesFilters {
  selfKeys: string[];
  teamKeys: string[];
  officeKeys: string[];
  deskKeys: string[];
}

export const roleFiltersConfig: Partial<
  Record<ListNames, IGetAllRolesFilters>
> = {
  [ListNames.LEADS]: {
    selfKeys: [
      'salesRepId',
      'retentionRepId',
      'financeRepId',
      'kycRepId',
      'supportRepId',
    ],
    teamKeys: [
      'salesManagerId',
      'supportManagerId',
      'kycManagerId',
      'financeManagerId',
      'retentionManagerId',
      'salesRepId',
      'retentionRepId',
      'financeRepId',
      'kycRepId',
      'supportRepId',
    ],
    officeKeys: ['officeId'],
    deskKeys: [
      'salesDeskId',
      'retentionDeskId',
      'financeDeskId',
      'kycDeskId',
      'supportDeskId',
    ],
  },
  [ListNames.CLIENTS]: {
    selfKeys: [
      'salesRepId',
      'retentionRepId',
      'financeRepId',
      'kycRepId',
      'supportRepId',
    ],
    teamKeys: [
      'salesManagerId',
      'supportManagerId',
      'kycManagerId',
      'financeManagerId',
      'retentionManagerId',
      'salesRepId',
      'retentionRepId',
      'financeRepId',
      'kycRepId',
      'supportRepId',
    ],
    officeKeys: ['officeId'],
    deskKeys: [
      'salesDeskId',
      'retentionDeskId',
      'financeDeskId',
      'kycDeskId',
      'supportDeskId',
    ],
  },
  [ListNames.APPLICANTS]: {
    selfKeys: [
      'salesRepId',
      'retentionRepId',
      'financeRepId',
      'kycRepId',
      'supportRepId',
    ],
    teamKeys: [
      'salesManagerId',
      'supportManagerId',
      'kycManagerId',
      'financeManagerId',
      'retentionManagerId',
      'salesRepId',
      'retentionRepId',
      'financeRepId',
      'kycRepId',
      'supportRepId',
    ],
    officeKeys: ['officeId'],
    deskKeys: [
      'salesDeskId',
      'retentionDeskId',
      'financeDeskId',
      'kycDeskId',
      'supportDeskId',
    ],
  },
  [ListNames.TRANSACTIONS]: {
    selfKeys: [
      'user.client.salesRepId',
      'user.client.retentionRepId',
      'user.client.financeRepId',
      'user.client.kycRepId',
      'user.client.supportRepId',
    ],
    teamKeys: [
      'user.client.salesManagerId',
      'user.client.supportManagerId',
      'user.client.kycManagerId',
      'user.client.financeManagerId',
      'user.client.retentionManagerId',
      'user.client.salesRepId',
      'user.client.retentionRepId',
      'user.client.financeRepId',
      'user.client.kycRepId',
      'user.client.supportRepId',
    ],
    officeKeys: ['user.client.officeId'],
    deskKeys: [
      'user.client.salesDeskId',
      'user.client.retentionDeskId',
      'user.client.financeDeskId',
      'user.client.kycDeskId',
      'user.client.supportDeskId',
    ],
  },
  [ListNames.MEETINGS]: {
    selfKeys: [
      'lead.salesRepId',
      'lead.retentionRepId',
      'lead.financeRepId',
      'lead.kycRepId',
      'lead.supportRepId',
    ],
    teamKeys: [
      'lead.salesRepId',
      'lead.retentionRepId',
      'lead.financeRepId',
      'lead.kycRepId',
      'lead.supportRepId',
      'lead.salesManagerId',
      'lead.retentionManagerId',
      'lead.financeManagerId',
      'lead.kycManagerId',
      'lead.supportManagerId',
    ],
    officeKeys: ['lead.officeId'],
    deskKeys: [
      'lead.salesDeskId',
      'lead.retentionDeskId',
      'lead.financeDeskId',
      'lead.kycDeskId',
      'lead.supportDeskId',
    ],
  },
  [ListNames.NOTES]: {
    selfKeys: [
      'lead_id.salesRepId',
      'lead_id.retentionRepId',
      'lead_id.financeRepId',
      'lead_id.kycRepId',
      'lead_id.supportRepId',
    ],
    teamKeys: [
      'lead_id.salesRepId',
      'lead_id.retentionRepId',
      'lead_id.financeRepId',
      'lead_id.kycRepId',
      'lead_id.supportRepId',
      'lead_id.salesManagerId',
      'lead_id.retentionManagerId',
      'lead_id.financeManagerId',
      'lead_id.kycManagerId',
      'lead_id.supportManagerId',
    ],
    officeKeys: ['lead_id.officeId'],
    deskKeys: [
      'lead_id.salesDeskId',
      'lead_id.retentionDeskId',
      'lead_id.financeDeskId',
      'lead_id.kycDeskId',
      'lead_id.supportDeskId',
    ],
  },
  [ListNames.LEADS_CALL_LOGS]: {
    selfKeys: [
      'lead.salesRepId',
      'lead.retentionRepId',
      'lead.financeRepId',
      'lead.kycRepId',
      'lead.supportRepId',
    ],
    teamKeys: [
      'lead.salesRepId',
      'lead.retentionRepId',
      'lead.financeRepId',
      'lead.kycRepId',
      'lead.supportRepId',
      'lead.salesManagerId',
      'lead.retentionManagerId',
      'lead.financeManagerId',
      'lead.kycManagerId',
      'lead.supportManagerId',
    ],
    officeKeys: ['lead.officeId'],
    deskKeys: [
      'lead.salesDeskId',
      'lead.retentionDeskId',
      'lead.financeDeskId',
      'lead.kycDeskId',
      'lead.supportDeskId',
    ],
  },
  [ListNames.OPPORTUNITY]: {
    selfKeys: [
      'lead.salesRepId',
      'lead.retentionRepId',
      'lead.financeRepId',
      'lead.kycRepId',
      'lead.supportRepId',
    ],
    teamKeys: [
      'lead.salesRepId',
      'lead.retentionRepId',
      'lead.financeRepId',
      'lead.kycRepId',
      'lead.supportRepId',
      'lead.salesManagerId',
      'lead.retentionManagerId',
      'lead.financeManagerId',
      'lead.kycManagerId',
      'lead.supportManagerId',
    ],
    officeKeys: ['lead.officeId'],
    deskKeys: [
      'lead.salesDeskId',
      'lead.retentionDeskId',
      'lead.financeDeskId',
      'lead.kycDeskId',
      'lead.supportDeskId',
    ],
  },
  [ListNames.EMAIL_INBOX]: {
    selfKeys: [
      'lead.salesRepId',
      'lead.retentionRepId',
      'lead.financeRepId',
      'lead.kycRepId',
      'lead.supportRepId',
    ],
    teamKeys: [
      'lead.salesRepId',
      'lead.retentionRepId',
      'lead.financeRepId',
      'lead.kycRepId',
      'lead.supportRepId',
      'lead.salesManagerId',
      'lead.retentionManagerId',
      'lead.financeManagerId',
      'lead.kycManagerId',
      'lead.supportManagerId',
    ],
    officeKeys: ['lead.officeId'],
    deskKeys: [
      'lead.salesDeskId',
      'lead.retentionDeskId',
      'lead.financeDeskId',
      'lead.kycDeskId',
      'lead.supportDeskId',
    ],
  },
  [ListNames.EMAIL_SENT_DRAFT]: {
    selfKeys: [
      'lead.salesRepId',
      'lead.retentionRepId',
      'lead.financeRepId',
      'lead.kycRepId',
      'lead.supportRepId',
    ],
    teamKeys: [
      'lead.salesRepId',
      'lead.retentionRepId',
      'lead.financeRepId',
      'lead.kycRepId',
      'lead.supportRepId',
      'lead.salesManagerId',
      'lead.retentionManagerId',
      'lead.financeManagerId',
      'lead.kycManagerId',
      'lead.supportManagerId',
    ],
    officeKeys: ['lead.officeId'],
    deskKeys: [
      'lead.salesDeskId',
      'lead.retentionDeskId',
      'lead.financeDeskId',
      'lead.kycDeskId',
      'lead.supportDeskId',
    ],
  },
  [ListNames.MT5_ACCOUNTS]: {
    selfKeys: [
      'user.client.salesRepId',
      'user.client.retentionRepId',
      'user.client.financeRepId',
      'user.client.kycRepId',
      'user.client.supportRepId',
    ],
    teamKeys: [
      'user.client.salesManagerId',
      'user.client.supportManagerId',
      'user.client.kycManagerId',
      'user.client.financeManagerId',
      'user.client.retentionManagerId',
      'user.client.salesRepId',
      'user.client.retentionRepId',
      'user.client.financeRepId',
      'user.client.kycRepId',
      'user.client.supportRepId',
    ],
    officeKeys: ['user.client.officeId'],
    deskKeys: [
      'user.client.salesDeskId',
      'user.client.retentionDeskId',
      'user.client.financeDeskId',
      'user.client.kycDeskId',
      'user.client.supportDeskId',
    ],
  },
  [ListNames.USER_KYC_DOCUMENTS]: {
    selfKeys: [
      'user.client.salesRepId',
      'user.client.retentionRepId',
      'user.client.financeRepId',
      'user.client.kycRepId',
      'user.client.supportRepId',
    ],
    teamKeys: [
      'user.client.salesManagerId',
      'user.client.supportManagerId',
      'user.client.kycManagerId',
      'user.client.financeManagerId',
      'user.client.retentionManagerId',
      'user.client.salesRepId',
      'user.client.retentionRepId',
      'user.client.financeRepId',
      'user.client.kycRepId',
      'user.client.supportRepId',
    ],
    officeKeys: ['user.client.officeId'],
    deskKeys: [
      'user.client.salesDeskId',
      'user.client.retentionDeskId',
      'user.client.financeDeskId',
      'user.client.kycDeskId',
      'user.client.supportDeskId',
    ],
  },
  [ListNames.TASKS]: {
    selfKeys: [
      'contact.salesRepId',
      'contact.retentionRepId',
      'contact.financeRepId',
      'contact.kycRepId',
      'contact.supportRepId',
      'lead.salesRepId',
      'lead.retentionRepId',
      'lead.financeRepId',
      'lead.kycRepId',
      'lead.supportRepId',
      'assignTo.operator.id',
      'createdBy.operator.id',
    ],
    teamKeys: [
      'contact.salesManagerId',
      'contact.salesRepId',
      'lead.salesManagerId',
      'contact.retentionManagerId',
      'contact.financeManagerId',
      'contact.kycManagerId',
      'contact.supportManagerId',
      'contact.retentionRepId',
      'contact.salesRepId',
      'contact.financeRepId',
      'contact.kycRepId',
      'contact.supportRepId',
      'lead.salesRepId',
      'lead.retentionRepId',
      'lead.financeRepId',
      'lead.kycRepId',
      'lead.supportRepId',
      'lead.salesManagerId',
      'lead.retentionManagerId',
      'lead.financeManagerId',
      'lead.kycManagerId',
      'lead.supportManagerId',
      'assignTo.operator.id',
      'createdBy.operator.id',
      // 'createdBy.operator.manager_operator_id',
    ],
    officeKeys: ['contact.officeId'],
    deskKeys: [
      'contact.salesDeskId',
      'contact.retentionDeskId',
      'contact.financeDeskId',
      'contact.kycDeskId',
      'contact.supportDeskId',
      'lead.salesDeskId',
      'lead.retentionDeskId',
      'lead.financeDeskId',
      'lead.kycDeskId',
      'lead.supportDeskId',
    ],
  },
  [ListNames.USER]: {
    selfKeys: [
      'client.salesRepId',
      'client.retentionRepId',
      'client.financeRepId',
      'client.kycRepId',
      'client.supportRepId',
    ],
    teamKeys: [
      'client.salesManagerId',
      'client.supportManagerId',
      'client.kycManagerId',
      'client.financeManagerId',
      'client.retentionManagerId',
      'client.salesRepId',
      'client.retentionRepId',
      'client.financeRepId',
      'client.kycRepId',
      'client.supportRepId',
    ],
    officeKeys: ['client.officeId'],
    deskKeys: [
      'client.salesDeskId',
      'client.retentionDeskId',
      'client.financeDeskId',
      'client.kycDeskId',
      'client.supportDeskId',
    ],
  },
  [ListNames.OPERATOR]: {
    selfKeys: [],
    teamKeys: ['manager_operator_id'],
    officeKeys: [],
    deskKeys: [],
  },
  [ListNames.CLIENT_TICKETS]: {
    selfKeys: [],
    teamKeys: [],
    officeKeys: [],
    deskKeys: [],
  },
  [ListNames.TICKETS]: {
    selfKeys: ['assignee.operator.id'],
    teamKeys: ['assignee.operator.manager_operator_id' , 'assignee.operator.id'],
    officeKeys: [],
    deskKeys: ['desk.id'],
  },
};

export class AdvanceSearch {
  private constructor() { }

  private static createQueryObject = (
    target: object,
    items: string[],
    value: FindOperator<any>,
    currentItem = 0,
    result?: object,
  ) => {
    const currentKey = items[currentItem];

    if (currentItem === items.length - 1) {
      target[currentKey] = value;
      return result || target;
    }

    if (!target[currentKey]) {
      target[currentKey] = {};
    }

    return AdvanceSearch.createQueryObject(
      target[currentKey],
      items,
      value,
      ++currentItem,
      result || target,
    );
  };
  private static createObject = (
    target: object,
    items: string[],
    value: any,
    currentItem = 0,
    result?: object,
  ) => {
    const currentKey = items[currentItem];

    if (currentItem === items.length - 1) {
      target[currentKey] = value;
      return result || target;
    }

    if (!target[currentKey]) {
      target[currentKey] = {};
    }

    return AdvanceSearch.createObject(
      target[currentKey],
      items,
      value,
      ++currentItem,
      result || target,
    );
  };
  private static operation(
    opr: FilterOperation,
    values: string[] | number[] | boolean[],
  ) {
    const operations = {
      EQUALS: <T>(val: T[]) => {
        if (val[0] === null) {
          return IsNull();
        }
        return Equal(val[0]);
      },
      NOT_EQUAL: <T>(val: T[]) => {
        if (val[0] === null) {
          return Not(IsNull());
        }
        return Not(Equal(val[0]));
      },
      GREATER_THAN: <T>(val: T[]) => MoreThan(val[0]),
      GREATER_THAN_OR_EQUAL: <T>(val: T[]) => MoreThanOrEqual(val[0]),
      LESS_THAN: <T>(val: T[]) => LessThan(val[0]),
      LESS_THAN_OR_EQUAL: <T>(val: T[]) => LessThanOrEqual(val[0]),
      CONTAINS: <T>(val: T[]) => Like(val[0]),
      STARTS_WITH: <T>(val: T[]) => Like(val[0]),
      ENDS_WITH: <T>(val: T[]) => Like(val[0]),
      IN: <T>(val: T[]) => In(val),
      NOT_IN: <T>(val: T[]) => Not(In(val)),
      BETWEEN: <T>(val: T[]) => Between(val[0], val[1]),
    };

    const result = operations[opr] || null;
    if (!result) {
      throw new BadRequestException('Invalid operation');
    }

    if (
      opr === FilterOperation.CONTAINS ||
      opr === FilterOperation.STARTS_WITH ||
      opr === FilterOperation.ENDS_WITH
    ) {
      values = values.map((val: string | number | boolean) => {
        if (typeof val !== 'string') {
          throw new BadRequestException('Contains must be a string');
        }

        if (opr === FilterOperation.STARTS_WITH) {
          return `${val}%`;
        } else if (opr === FilterOperation.ENDS_WITH) {
          return `%${val}`;
        }
        return `%${val}%`;
      });
    }
    return result<(typeof values)[0]>(values);
  }
  static sorting<T>(sorting?: SortItem[]) {
    const orderObj: FindOptionsOrder<T> = {};
    if (Array.isArray(sorting) && sorting.length) {
      sorting.forEach(({ key, order }: SortItem) => {
        const params = key.split('.');
        AdvanceSearch.createQueryObject(orderObj, params, order as any);
      });
    }
    return orderObj;
  }

  static query<T>(filters: FilterItem[]) {
    const where: FindOptionsWhere<T> = {};
    try {
      filters.forEach(({ operation, value, name }: FilterItem) => {
        const opr = AdvanceSearch.operation(operation, value);
        const params = name.split('.');
        AdvanceSearch.createQueryObject(where, params, opr);
      });
      return where;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static stringToobject(str: string, value: any) {
    const obj = {};
    const keys = str.split('.');
    let current = obj;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i === keys.length - 1) {
        current[key] = value;
      } else {
        current[key] = {};
        current = current[key];
      }
    }
    return obj;
  }

  static getQueryErrorMessage(error: Error, filters: FilterItem[]) {
    let message: null | string = null;

    if (error instanceof EntityPropertyNotFoundError) {
      const regex = /"([^"]+)"/;
      const match = error.message.match(regex);
      if (match && match?.length) {
        const property = match[1];
        message = `Property ${property} not found`;
      }
    } else if (error instanceof QueryFailedError) {
      const regex = /'([^']+)'/;
      const match = error.message.match(regex);
      if (match && match.length) {
        const value = match[1];
        message = `Invalid value ${value}`;
        const properties = filters.filter((f) => {
          return f.value[0] === value || f.value[1] === value;
        });
        if (properties.length) {
          let propertyNames = '';
          properties.map((property, index, array) => {
            const isLast = array.length - 1 === index;
            if (!propertyNames) {
              propertyNames = `${property.name}`;
            } else {
              propertyNames = `${propertyNames} ${property.name}`;
            }
            if (!isLast) {
              propertyNames = `${propertyNames} OR`;
            }
          });
          message = `${message} for ${propertyNames}`;
        }
      }
    }
    return message;
  }

  static getListRepository(dataSource: DataSource, listName: ListNames) {
    const repo = dataSource.manager.getRepository(repositories[listName]);
    if (!repo) {
      throw new NotFoundException(`List ${listName} not found`);
    }
    return repo;
  }

  static toPropertyToHumanReadable(key: string) {
    if (key.toUpperCase() === key) {
      return key.toLowerCase().replace(/^./, (str) => str.toUpperCase());
    }

    if (key.includes('_')) {
      let result = key.replace(/_/g, ' ').toLowerCase();
      result = result.replace(/\b\w/g, (char) => char.toUpperCase());
      return result;
    } else {
      return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());
    }
  }

  static getColumnType(typeFunction: any) {
    switch (typeFunction) {
      case String:
        return 'STRING';
      case Number:
        return 'NUMBER';
      case Boolean:
        return 'BOOLEAN';
      case Date:
        return 'DATE';
      default:
        return 'UNKNOWN';
    }
  }

  static isPropertyAllowed(property: string, list: ListNames) {
    const isNotAllowed = AdvanceFilterMetaData.isPropertyNotAllowed(
      list,
      property,
    );
    if (property.toLowerCase().includes('deleted')) {
      return false;
    }
    return !isNotAllowed;
  }

  static getEntityMetadata(Entity, listName: ListNames) {
    const metadata = getMetadataArgsStorage();
    const list = metadata.columns.filter((col) => col.target === Entity);

    const fields: { name: string; label: string; type: string }[] = [];
    list.forEach((col) => {
      const type = Reflect.getMetadata(
        'design:type',
        new Entity(),
        col.propertyName,
      );

      const property = col.propertyName;
      const columnType = AdvanceSearch.getColumnType(type);
      const isAllowed = AdvanceSearch.isPropertyAllowed(property, listName);
      const normalizeLabel = AdvanceSearch.toPropertyToHumanReadable(property);
      const label = AdvanceFilterMetaData.getPropertyLabel(
        listName,
        property,
        normalizeLabel,
      );
      if (columnType !== 'UNKNOWN' && isAllowed) {
        const item = {
          name: property,
          label,
          type: columnType,
        };
        fields.push(item);
      }
    });
    const metaData = AdvanceFilterMetaData.getEntityMetaData(listName);
    metaData.forEach((field) => {
      fields.push(field);
    });
    return fields;
  }

  static deepMerge(target: any, source: any) {
    const output = Object.assign({}, target);
    if (AdvanceSearch.isObject(target) && AdvanceSearch.isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (AdvanceSearch.isObject(source[key])) {
          if (!(key in target)) Object.assign(output, { [key]: source[key] });
          else output[key] = AdvanceSearch.deepMerge(target[key], source[key]);
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  static isObject(item: any) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  static safeParseJSON(jsonString: string): any[] {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Failed to parse JSON', { jsonString, error });
      throw new BadRequestException('Invalid JSON format for filterRefIds');
    }
  }
}
