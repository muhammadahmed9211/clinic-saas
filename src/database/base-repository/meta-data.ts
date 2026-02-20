import { ColumnsTypeEnum } from 'src/list-columns-meta/dto/create-list-columns-meta.dto';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';

interface IMetaData {
  isFilterAble: boolean;
  isSortable: boolean;
  name: string;
  label: string;
  type: ColumnsTypeEnum;
}

interface IMetaDataConfig {
  [key: string]: IMetaData[];
}

interface IPropertyLabels {
  [key: string]: { [key: string]: string };
}

interface IProperAllow {
  [key: string]: { [key: string]: boolean };
}

const NOT_ALLOWED: IProperAllow = {
  [ListNames.USER_KYC_DOCUMENTS]: {
    state: true,
    reasons: true,
    fileId: true,
    side: true,
  },
  [ListNames.CLIENTS]: {
    clientId: true,
    userSignature: true,
    groupString: true,
    questionAnswers: true,
    registrationNotes: true,
    visitId: true,
    rootExternalId: true,
    secondApplicantFullName: true,
    mothersName: true,
    secondPrefix: true,
    secondTelephone: true,
    ssnTinNumber: true,
    price: true,
    brokerName: true,
    liquidAssets: true,
    testUserMode: true,
    isShowInvestments: true,
    isAutomaticTransfer: true,
    notes: true,
    previouslyNI: true,
    topTradingProducts: true,
    NORMBALANCE: true,
    NORMCREDIT: true,
    NORMFEES: true,
    NORMEQUITY: true,
    NORMMARGIN: true,
    NORMOPENPNL: true,
    NORMCLOSEPNL: true,
    NORMNETDEPOSIT: true,
    tickets: true,
    tone: true,
    tradingAccExternalIds: true,
    uspsProperlyMentioned: true,
    appsFlyerId: true,
    id2: true,
    affiliate: true,
    acquisitionStatus: true,
    bankAccountName: true,
    bankAccountNumber: true,
    bankBranchName: true,
    bankComment: true,
    bankCountryIso: true,
    bankName: true,
    bankSwiftCode: true,
    email_sent_for_review: true,
  },
  [ListNames.TRANSACTIONS]: {
    hash: true,
    pspNameManual: true,
    acquisitionStatus: true,
    creditBonus: true,
    balanceBonus: true,
    binType: true,
    subPspName: true,
    subPspTransactionId: true,
    fee: true,
    indexName: true,
    subIndexName: true,
    normalizedAmount: true,
    normalizedFee: true,
    ip: true,
    requestId: true,
    is3dSecure: true,
    isTest: true,
    isResumable: true,
    request: true,
    response: true,
    responseTime: true,
    isFtd: true,
    decisionTime: true,
    parentRequestId: true,
    ownerExternalId: true,
    externalAmount: true,
    externalCurrency: true,
    requestIdType: true,
    subPspPaymentMethod: true,
    referenceKey: true,
    referenceKeyName: true,
    cardIssuer: true,
    cardExpirationMonth: true,
    cardExpirationYear: true,
    cardHolderName: true,
    cardType: true,
    lastStatus: true,
    customParam1: true,
    customParam2: true,
    customParam3: true,
    customParam4: true,
    customParam5: true,
    customParam6: true,
    customParam7: true,
    customParam8: true,
    customParam9: true,
    customParam10: true,
    customParam11: true,
    customParam12: true,
    customParam13: true,
    customParam14: true,
    customParam15: true,
    customParam16: true,
    customParam17: true,
    customParam18: true,
    customParam19: true,
    customParam20: true,
  },
  [ListNames.AGGREGATOR]: {
    name: true,
    description: true,
    isActive: true,
  },
  [ListNames.PSP]: {
    rolloverType: true,
    clientWithdrawalFeeType: true,
    clientDepositFeeType: true,
    withdrawalFeeType: true,
    depositFeeType: true,
    isActive: true,
    description: true,
    name: true,
  },
  [ListNames.COMPANY_BANK_ACCOUNT]: {
    swift: true,
    bankAddress: true,
    additionalInformation: true,
    reference: true,
    companyAddress: true,
    intermediateBankName: true,
    branchCode: true,
    logo: true,
    logoId: true,
  },
};

const PROPERTY_LABELS: IPropertyLabels = {
  [ListNames.USER_KYC_DOCUMENTS]: {
    field_id: 'Type',
  },
  [ListNames.CLIENTS]: {
    affid: 'Partner Id',
  },
  [ListNames.AGGREGATOR]: {
    displayName: 'Aggregator PSP',
    fee: 'PSP Fees',
  },
  [ListNames.PSP]: {
    aggregatorName: 'Aggregator PSP',
    fee: 'PSP Fees',
    displayName: 'PSP Name',
    rollover: 'Rollover Amount Percentage',
  },
  [ListNames.COMPANY_BANK_ACCOUNT]: {
    currency: 'Account Currency',
    bankName: 'Bank Name',
    accountName: 'Account Title',
    accountNumber: 'Account Number',
    iban: 'IBAN',
    branchName: 'Branch Name',
    country: 'Bank Country',
    sortCode: 'Zip Code',
  },
};

const META_DATA: IMetaDataConfig = {
  [ListNames.TRANSACTIONS]: [
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.firstName',
      label: 'First Name',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.lastName',
      label: 'Last Name',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'method.method',
      label: 'Method',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'psp.name',
      label: 'PSP',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.id',
      label: 'User ID',
      type: ColumnsTypeEnum.NUMBER,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.office',
      label: 'Office',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.partner.name',
      label: 'Partner',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.customKycStatus.name',
      label: 'Custom Kyc Status',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.telephone',
      label: 'Telephone',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.telephonePrefix',
      label: 'Telephone Prefix',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.city',
      label: 'City',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.country',
      label: 'User Country',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.salesDesk',
      label: 'Sales Desk',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.retentionDesk',
      label: 'Retention Desk',
      type: ColumnsTypeEnum.STRING,
    },
  ],
  [ListNames.USER_KYC_DOCUMENTS]: [
    {
      isFilterAble: false,
      isSortable: false,
      name: 'attachments.front',
      label: 'Document',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'customKycStatus.name',
      label: 'Custom Kyc Status',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'userKYCDocumentDetails.classification',
      label: 'Classification',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'userKYCDocumentDetails.documentExpiryDate',
      label: 'Document Expiry Date',
      type: ColumnsTypeEnum.DATE,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'approvedBy.firstName',
      label: 'Approved By First Name',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.lastName',
      label: 'Last Name',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.firstName',
      label: 'First Name',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.office',
      label: 'Office',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.partner.name',
      label: 'Partner Name',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.telephone',
      label: 'Telephone',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.telephonePrefix',
      label: 'Telephone Prefix',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.country',
      label: 'Country',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.city',
      label: 'City',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.salesDesk',
      label: 'Sales Desk',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.retentionDesk',
      label: 'Retention Desk',
      type: ColumnsTypeEnum.STRING,
    },
  ],
  [ListNames.TASKS]: [
    {
      isFilterAble: true,
      isSortable: true,
      name: 'assignTo.firstName',
      label: 'Assign to first Name',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'assignTo.lastName',
      label: 'Assign to last Name',
      type: ColumnsTypeEnum.STRING,
    },
  ],
  [ListNames.MT5_ACCOUNTS]: [
    {
      isFilterAble: true,
      isSortable: true,
      name: 'server.name',
      label: 'Server',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'server.id',
      label: 'Server ID',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'server.type',
      label: 'Platform',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.firstName',
      label: 'First Name',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.lastName',
      label: 'Last Name',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.id',
      label: 'User ID',
      type: ColumnsTypeEnum.NUMBER,
    },
    {
      isFilterAble: false,
      isSortable: false,
      name: 'marginFree',
      label: 'Margin Fee',
      type: ColumnsTypeEnum.NUMBER,
    },
    {
      isFilterAble: false,
      isSortable: false,
      name: 'group',
      label: 'Group',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: false,
      isSortable: false,
      name: 'balance',
      label: 'Balance',
      type: ColumnsTypeEnum.NUMBER,
    },
    {
      isFilterAble: false,
      isSortable: false,
      name: 'equity',
      label: 'Equity',
      type: ColumnsTypeEnum.NUMBER,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.office',
      label: 'Office',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.partner.name',
      label: 'Partner Name',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.telephone',
      label: 'Telephone',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.telephonePrefix',
      label: 'Telephone Prefix',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.country',
      label: 'Country',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.city',
      label: 'City',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.salesDesk',
      label: 'Sales Desk',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.retentionDesk',
      label: 'Retention Desk',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.client.customKycStatus.name',
      label: 'Kyc Status',
      type: ColumnsTypeEnum.STRING,
    },
  ],
  [ListNames.CLIENTS]: [
    {
      isFilterAble: true,
      isSortable: true,
      name: 'partner.name',
      label: 'Partner Name',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'customKycStatus.name',
      label: 'Kyc Status',
      type: ColumnsTypeEnum.STRING,
    },
  ],
  [ListNames.AGGREGATOR]: [
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.firstName',
      label: 'User First Name',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.lastName',
      label: 'User Last Name',
      type: ColumnsTypeEnum.STRING,
    },
  ],
  [ListNames.PSP]: [
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.firstName',
      label: 'User First Name',
      type: ColumnsTypeEnum.STRING,
    },
    {
      isFilterAble: true,
      isSortable: true,
      name: 'user.lastName',
      label: 'User Last Name',
      type: ColumnsTypeEnum.STRING,
    },
  ],
};

export class AdvanceFilterMetaData {
  static isPropertyNotAllowed(name: ListNames, property: string): boolean {
    let isNotAllowed = false;
    const properties = NOT_ALLOWED[name];
    if (properties && properties[property]) {
      isNotAllowed = true;
    }
    return isNotAllowed;
  }

  static getEntityMetaData(name: ListNames): IMetaData[] {
    if (Array.isArray(META_DATA[name])) {
      return META_DATA[name];
    }
    return [];
  }

  static getPropertyLabel(
    name: ListNames,
    property: string,
    currentLabel: string,
  ): string {
    const properties = PROPERTY_LABELS[name];
    let label = currentLabel;
    if (properties && properties[property]) {
      label = properties[property];
    }
    return label;
  }
}
