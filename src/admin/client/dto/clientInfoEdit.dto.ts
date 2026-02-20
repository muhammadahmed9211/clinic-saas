import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Client } from 'src/users/entities/client.entity';

export class ClientInfoUpdateDTO {
  // data: ClientInfoUpdateDTO;

  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  lastName?: string;

  @ApiProperty({ example: 'Jane Doe', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  secondApplicantFullName?: string;

  @ApiProperty({ example: 'Mary', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  mothersName?: string;

  @ApiProperty({ example: 'US', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  countryOfBirth?: string;

  @ApiProperty({ example: '123 Main St', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  fullAddress?: string;

  @ApiProperty({ example: 'USA', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  country?: string;

  @ApiProperty({ example: 'PK', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  countryIso?: string;

  @ApiProperty({ example: 'USA', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  countryOfResidence?: string;

  @ApiProperty({ example: 'English', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  language?: string;

  @ApiProperty({ example: 'EN', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  languageIso?: string;

  @ApiProperty({ example: '+1', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  telephonePrefix?: string;

  @ApiProperty({ example: '1234567890', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  telephone?: string;

  @ApiProperty({ example: '+1', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  secondPrefix?: string;

  @ApiProperty({ example: '9876543210', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  secondTelephone?: string;

  @ApiProperty({ example: 'john_doe', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  skype?: string;

  @ApiProperty({ example: '123456', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  drivingLicenseNumber?: string;

  @ApiProperty({ example: 'ABC123', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  idPassportNumber?: string;

  @ApiProperty({ example: '123-45-6789', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ssnTinNumber?: string;

  @ApiProperty({ example: '1990-01-01', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  dateOfBirth?: string;

  @ApiProperty({ example: 'US', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  nationality?: string;

  @ApiProperty({ example: 'Male', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  gender?: string;

  @ApiProperty({ example: '12345', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  countrySpecificIdentifier?: string;

  @ApiProperty({ example: 'Passport', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  countrySpecificIdentifierType?: string;

  @ApiProperty({ example: 'CA', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  state?: string;

  @ApiProperty({ example: 'Los Angeles', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  city?: string;

  @ApiProperty({ example: '123 ABC St', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  addressStreetName?: string;

  @ApiProperty({ example: '12345', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  postalCode?: string;

  @ApiProperty({ example: '123', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  houseNo?: string;

  @ApiProperty({ example: '456', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  poBox?: string;

  @ApiProperty({ example: 'Note for KYC', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  kycNote?: string;

  @ApiProperty({ example: 123, required: false })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  kycStatus?: number;

  @ApiProperty({ example: 'Note for KYC', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  kycWorkflowStatus?: string;

  @ApiProperty({ example: 'Yes', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  dualCitizenship?: string;

  @ApiProperty({ example: 'US', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  countryOfCitizenship?: string;

  @ApiProperty({ example: 'Individual Customer', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  type?: string;

  @ApiProperty({ example: 'Fraud', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  abuseReason?: string;

  @ApiProperty({ example: '100', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  price?: string;

  @ApiProperty({ example: 'John Doe Broker', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  brokerName?: string;

  @ApiProperty({ example: '50000', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  liquidAssets?: string;

  @ApiProperty({ example: '1', required: false })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  clientId?: number;

  @ApiProperty({ example: '+92', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  thirdPrefix?: string;

  @ApiProperty({ example: '3242328207', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  thirdTelephone?: string;

  @ApiProperty({ example: 'admin@example.com', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  email?: string;

  @ApiProperty({ example: 'FSCA', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  regulations?: string;

  @ApiProperty({ example: 123, required: false })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  regulationId?: number;

  // @ApiProperty({ example: 'AAA', required: false })
  // @IsOptional()
  // @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  // clientGrading?: string;

  // @ApiProperty({ example: 'Direct', required: false })
  // @IsOptional()
  // @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  // source?: string;

  @ApiProperty({ example: 'Example Live 1', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  referral?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  officeId?: number;

  @ApiProperty({ example: 'Office', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  office?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  salesDeskId?: number;

  @ApiProperty({ example: 'Sales', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  salesDesk?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  salesRepId?: number;

  @ApiProperty({ example: 'Sales', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  salesRep?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  internalSalesStatus?: number;

  @ApiProperty({ example: 'Sales', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  internalSalesStatusName?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  retentionDeskId?: number;

  @ApiProperty({ example: 'Retention', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  retnetionDesk?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  retentionRepId?: number;

  @ApiProperty({ example: 'Retention', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  retnetionRep?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  internalRetentionStatus?: number;

  @ApiProperty({ example: 'Retention', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  internalRetentionStatusName?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  affid?: number;

  @ApiProperty({ example: 'Partner Name', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  affIdName?: string;

  @ApiProperty({ example: 'Example Live 1', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  server?: string;

  @ApiProperty({ example: '123', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  acquisitionStatus?: string;

  @ApiProperty({ example: 123, required: false })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  affiliateLinkId?: number;

  @ApiProperty({ example: 123, required: false })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  appsFlyerId?: number;

  @ApiProperty({ example: '123', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  bankAccountName?: string;

  @ApiProperty({ example: '123', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  bankAccountNumber?: string;

  @ApiProperty({ example: '123', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  bankBranchName?: string;

  @ApiProperty({ example: '123', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  tradingStyle?: string;

  @ApiProperty({ example: '123', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  campaignQuestions?: string;

  @ApiProperty({ example: 123, required: false })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  statusId?: number;

  @ApiProperty({ example: 123, required: false })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  clickId?: number;

  @ApiProperty({ example: 123, required: false })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  clientPotential?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  creationTime?: Date;

  @ApiProperty({ example: '2024-06-04 12:25:48.136', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  localTime?: string;

  @ApiProperty({ example: '2024-06-04 12:25:48.136', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  preferredTime?: string;

  @ApiProperty({ example: '2', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  totalDeposits?: string;

  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  createdBy?: string;

  @ApiProperty({ example: 'doe', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  modifiedBy?: string;

  @ApiProperty({ example: 'john123', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  skypeID?: string;

  @ApiProperty({ example: 'Title', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  leadTitle?: string;

  @ApiProperty({ example: 123, required: false })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  leadId?: number;

  @Exclude()
  adjustedFtdAmount?: number;

  @Exclude()
  FTD?: boolean;

  @Exclude()
  ftdAmount?: number;

  @ApiProperty({ required: false, example: 'English' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  speakingLanguage?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  commissionProfileId?: number;

  @ApiProperty({ example: "test" })
  @IsOptional()
  commissionProfileName?: string;
}

export class ClientFdaUpdateInfo {
  @IsNotEmpty()
  @IsNumber()
  adjustedFtdAmount?: number;
}

// client-info.dto.ts

// client-info.dto.ts

export class ClientInfoDTO {
  firstName: string;
  lastName: string;
  secondApplicantFullName: string;
  mothersName: string;
  countryOfBirth: string;
  fullAddress: string;
  country: string;
  countryIso: string;
  countryOfResidence: string;
  language: string;
  languageIso: string;
  prefix: string;
  telephone: string;
  secondPrefix: string;
  secondTelephone: string;
  skype: string;
  drivingLicenseNumber: string;
  idPassportNumber: string;
  ssnTinNumber: string;
  dateOfBirth: Date | null;
  nationality: string;
  gender: string;
  countrySpecificIdentifier: string;
  countrySpecificIdentifierType: string;
  state: string;
  city: string;
  addressStreetName: string;
  postalCode: string;
  houseNo: string;
  poBox: string;
  kycNote: string;
  dualCitizenship: string;
  countryOfCitizenship: string;
  type: string;
  abuseReason: string;
  price: string;
  brokerName: string;
  liquidAssets: string;
  clientId: number;
  thirdPrefix: string;
  thirdTelephone: string;
  email: string;
  regulations: string;
  regulationId: number;
  clientGrading: string;
  source: string;
  referral: string;
  officeId: number;
  office: string;
  salesDeskId: number;
  salesDesk: string;
  salesRepId: number;
  salesRep: string;
  salesManagerId: number;
  salesManager: string;
  salesStatus: string;
  retentionDeskId: number;
  retentionDesk: string;
  retentionRepId: number;
  retentionRep: string;
  retentionManagerId: number;
  retentionManager: string;
  retentionStatus: string;
  financeDeskId: number;
  financeDesk: string;
  financeRepId: number;
  financeRep: string;
  financeStatusId: number;
  financeManagerId: number;
  financeManager: string;
  financeStatus: string;
  supportDeskId: number;
  supportDesk: string;
  supportRepId: number;
  supportRep: string;
  supportStatusId: number;
  supportStatus: string;
  partnerName: string;
  partnerId: number;
  kycDeskId: number;
  kycDesk: string;
  kycRepId: number;
  kycRep: string;
  server: string;
  kycStatus: number;
  kycStatusName: string;
  timesOfFTD: Date;
  timesOfLTD: Date;
  depositCount: number;
  registrationTime: Date;
  registrationDevice: Date;
  lastCommunicationTime: Date;
  topTradingProducts: string;
  lastTimeLogin: Date;
  modifiedTime: Date;
  ip: string;
  lastTradeTime: Date;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  campaignId: string;
  internalRetentionStatus: number;
  internalSalesStatus: number;
  localTime: string;
  preferredTime: string;
  totalDeposits: string;
  createdBy: string;
  modifiedBy: string;
  skypeID: string;
  leadTitle: string;
  leadId: number | null;
  userLifeCycle: string;
  hasAttendedEvent: boolean;
  lastAttendedDate: Date;
  minutesOfAttendance: number
  ftdAmount: number | null;
  adjustedFtdAmount: number | null;
  speakingLanguage: string | null;

  static fromEntity(entity: Client): ClientInfoDTO {
    const dto = new ClientInfoDTO();
    dto.firstName = entity?.firstName ?? null;
    dto.lastName = entity?.lastName ?? null;
    dto.secondApplicantFullName = entity?.secondApplicantFullName ?? null;
    dto.mothersName = entity?.mothersName ?? null;
    dto.countryOfBirth = entity?.countryOfBirth ?? null;
    dto.fullAddress = entity?.fullAddress ?? null;
    dto.country = entity?.country ?? null;
    dto.countryIso = entity?.countryIso ?? null;
    dto.countryOfResidence = entity?.countryOfResidence ?? null;
    dto.language = entity?.language ?? null;
    dto.languageIso = entity?.languageIso ?? null;
    dto.prefix = entity?.telephonePrefix ?? null;
    dto.telephone = entity?.telephone ?? null;
    dto.secondPrefix = entity?.secondPrefix ?? null;
    dto.secondTelephone = entity?.secondTelephone ?? null;
    dto.skype = entity?.skype ?? null;
    dto.drivingLicenseNumber = entity?.drivingLicenseNumber ?? null;
    dto.idPassportNumber = entity?.idPassportNumber ?? null;
    dto.ssnTinNumber = entity?.ssnTinNumber ?? null;
    dto.dateOfBirth = entity?.dateOfBirth;
    dto.nationality = entity?.nationality ?? null;
    dto.gender = entity?.gender ?? null;
    dto.countrySpecificIdentifier = entity?.countrySpecificIdentifier ?? null;
    dto.countrySpecificIdentifierType =
      entity?.countrySpecificIdentifierType ?? null;
    dto.state = entity?.state ?? null;
    dto.city = entity?.city ?? null;
    dto.addressStreetName = entity?.addressStreetName ?? null;
    dto.postalCode = entity?.postalCode ?? null;
    dto.houseNo = entity?.houseNo ?? null;
    dto.poBox = entity?.poBox ?? null;
    dto.kycNote = entity?.kycNote ?? null;
    dto.dualCitizenship = entity?.dualCitizenship ?? null;
    dto.countryOfCitizenship = entity?.countryOfCitizenship ?? null;
    dto.type = entity?.type ?? null;
    dto.abuseReason = entity?.abuseReason ?? null;
    dto.price = entity?.price ?? null;
    dto.brokerName = entity?.brokerName ?? null;
    dto.liquidAssets = entity?.liquidAssets ?? null;
    dto.clientId = entity?.userId ?? null;
    dto.thirdPrefix = entity?.thirdPrefix ?? null;
    dto.thirdTelephone = entity?.thirdTelephone ?? null;
    dto.email = entity?.email ?? null;
    dto.regulations = entity?.regulations ?? null;
    dto.regulationId = entity?.regulation?.id ?? null;
    dto.clientGrading = entity?.clientGrading ?? null;
    dto.source = entity?.source ?? null;
    dto.referral = entity?.referral ?? null;
    dto.officeId = entity?.officeId ?? null;
    dto.office = entity?.office ?? null;
    dto.salesDeskId = entity?.salesDeskId ?? null;
    dto.salesDesk = entity?.salesDesk ?? null;
    dto.salesRepId = entity?.salesRepId ?? null;
    dto.salesRep = entity?.salesRep ?? null;
    dto.salesManagerId = entity?.salesManagerId ?? null;
    dto.salesManager = entity?.salesManager ?? null;
    dto.salesStatus = entity?.customSaleStatus?.name ?? null;
    dto.retentionDeskId = entity?.retentionDeskId ?? null;
    dto.retentionDesk = entity?.retentionDesk ?? null;
    dto.retentionRepId = entity?.retentionRepId ?? null;
    dto.retentionRep = entity?.retentionRep ?? null;
    dto.retentionManagerId = entity?.retentionManagerId ?? null;
    dto.retentionManager = entity?.retentionManager ?? null;
    dto.retentionStatus = entity?.customRetentionStatus?.name ?? null;
    dto.financeDeskId = entity?.financeDeskId ?? null;
    dto.financeDesk = entity?.financeDesk ?? null;
    dto.financeRepId = entity?.financeRepId ?? null;
    dto.financeRep = entity?.financeRep ?? null;
    dto.financeManagerId = entity?.financeManagerId ?? null;
    dto.financeManager = entity?.financeManager ?? null;
    dto.financeStatusId = entity?.financeStatusId ?? null;
    dto.financeStatus = entity?.financeStatus ?? null;
    dto.supportDeskId = entity?.supportDeskId ?? null;
    dto.supportDesk = entity?.supportDesk ?? null;
    dto.supportRepId = entity?.supportRepId ?? null;
    dto.supportRep = entity?.supportRep ?? null;
    dto.supportStatusId = entity?.suppoertStatusId ?? null;
    dto.supportStatus = entity?.supportStatus ?? null;
    dto.partnerName = entity?.partner?.name ?? null;
    dto.partnerId = entity?.affid ?? null;
    dto.kycDeskId = entity?.kycDeskId ?? null;
    dto.kycDesk = entity?.kycDesk ?? null;
    dto.kycRepId = entity?.kycRepId ?? null;
    dto.kycRep = entity?.kycRep ?? null;
    dto.server = entity?.server ?? null;
    dto.kycStatus = entity?.kycStatus ?? null;
    dto.kycStatusName = entity?.customKycStatus?.name ?? null;
    dto.timesOfFTD = entity?.timesOfFTD ?? null;
    dto.timesOfLTD = entity?.timesOfLTD ?? null;
    dto.depositCount = entity?.depositCount ?? null;
    dto.registrationTime = entity?.registrationTime ?? null;
    dto.registrationDevice = entity?.registrationDevice ?? null;
    dto.lastCommunicationTime = entity?.lastCommunicationTime ?? null;
    dto.topTradingProducts = entity?.topTradingProducts ?? null;
    dto.lastTimeLogin = entity?.lastTimeLogin ?? null;
    dto.modifiedTime = entity?.modifiedTime ?? null;
    dto.ip = entity?.ip ?? null;
    dto.lastTradeTime = entity?.lastTradeTime ?? null;
    dto.utmSource = entity?.utmSource ?? null;
    dto.utmMedium = entity?.utmMedium ?? null;
    dto.utmCampaign = entity?.utmCampaign ?? null;
    dto.utmContent = entity?.utmContent ?? null;
    dto.utmTerm = entity?.utmTerm ?? null;
    dto.campaignId = entity?.campaignId ?? null;
    dto.internalSalesStatus = entity?.customSaleStatus.id ?? null;
    dto.internalRetentionStatus = entity?.customRetentionStatus.id ?? null;
    dto.localTime = entity?.localTime ?? null;
    dto.preferredTime = entity?.preferredTime ?? null;
    dto.totalDeposits = entity?.totalDeposits ?? null;
    dto.createdBy = entity?.createdBy ?? null;
    dto.modifiedBy = entity?.modifiedBy ?? null;
    dto.skypeID = entity?.skypeID ?? null;
    dto.leadTitle = entity?.leadTitle ?? null;
    dto.leadId = entity?.leadId ?? null;
    dto.adjustedFtdAmount = entity.adjustedFtdAmount
    dto.userLifeCycle = entity?.userLifeCycle ?? null;
    dto.hasAttendedEvent = entity?.lead.hasAttendedEvent ?? null;
    dto.lastAttendedDate = entity?.lead.lastAttendedDate ?? null;
    dto.minutesOfAttendance = entity?.lead.minutesOfAttendance ?? null;

    dto.ftdAmount = entity?.ftdAmount ?? null;
    dto.adjustedFtdAmount = entity?.adjustedFtdAmount ?? null;
    dto.speakingLanguage = entity.lead.speakingLanguage ?? null;
    return dto;
  }
}
