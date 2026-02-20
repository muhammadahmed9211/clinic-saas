import { PartialType } from '@nestjs/swagger';
import { CreateClientDto } from './create-client.dto';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities/role.entity';
import { IsEmail, IsOptional, MinLength, Validate } from 'class-validator';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';
import { FileEntity } from '../../files/entities/file.entity';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { Status } from '../../statuses/entities/status.entity';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @Validate(IsNotExist, ['User'], {
    message: i18nValidationMessage('errors.auth.emailExists'),
  })
  @IsEmail()
  email?: string | null;

  @ApiProperty()
  @IsOptional()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  firstName?: string | null;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  lastName?: string | null;

  @ApiProperty({ type: () => FileEntity })
  @IsOptional()
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: i18nValidationMessage('errors.client.imageExist'),
  })
  photo?: FileEntity | null;

  @ApiProperty({ type: Role })
  @IsOptional()
  @Validate(IsExist, ['Role', 'id'], {
    message: i18nValidationMessage('errors.client.roleNotExist'),
  })
  role?: Role | null;

  @ApiProperty({ type: Status })
  @IsOptional()
  @Validate(IsExist, ['Status', 'id'], {
    message: i18nValidationMessage('errors.client.statusNotExist'),
  })
  status?: Status;

  hash?: string | null;

  @ApiProperty()
  @IsOptional()
  userId?: number;

  @ApiProperty()
  @IsOptional()
  groupString?: string;

  @ApiProperty()
  @IsOptional()
  telephone: string;

  @ApiProperty()
  @IsOptional()
  telephonePrefix: string;

  @ApiProperty()
  @IsOptional()
  id2?: string;

  @ApiProperty()
  @IsOptional()
  fullAddress?: string;

  @ApiProperty()
  @IsOptional()
  poBox?: string;

  @ApiProperty()
  @IsOptional()
  city?: string;

  @ApiProperty()
  @IsOptional()
  state?: string;

  @ApiProperty()
  @IsOptional()
  zip?: string;

  @ApiProperty()
  @IsOptional()
  dateOfBirth?: Date;

  @ApiProperty()
  @IsOptional()
  telephoneValid?: boolean;

  @ApiProperty()
  @IsOptional()
  affid?: string;

  @ApiProperty()
  @IsOptional()
  question2?: string;

  @ApiProperty()
  @IsOptional()
  agreementData?: string;

  @ApiProperty()
  @IsOptional()
  userSignature?: string;

  @ApiProperty()
  @IsOptional()
  mobile?: string;

  @ApiProperty()
  @IsOptional()
  questionAnswers?: string;

  @ApiProperty()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty()
  @IsOptional()
  registrationNotes?: string;

  @ApiProperty()
  @IsOptional()
  p1?: string;

  @ApiProperty()
  @IsOptional()
  p2?: string;

  @ApiProperty()
  @IsOptional()
  p3?: string;

  @ApiProperty()
  @IsOptional()
  p4?: string;

  @ApiProperty()
  @IsOptional()
  p5?: string;

  @ApiProperty()
  @IsOptional()
  p6?: string;

  @ApiProperty()
  @IsOptional()
  visitId?: string;

  @ApiProperty()
  @IsOptional()
  userAgent?: string;

  @ApiProperty()
  @IsOptional()
  referral?: string;

  @ApiProperty()
  @IsOptional()
  queryString?: string;

  @ApiProperty()
  @IsOptional()
  rootExternalId?: string;

  @ApiProperty()
  @IsOptional()
  dstTimeZoneoffset?: string;

  @ApiProperty()
  @IsOptional()
  isBlockEmails?: string;

  @ApiProperty()
  @IsOptional()
  utmSource?: string;

  @ApiProperty()
  @IsOptional()
  utmMedium?: string;

  @ApiProperty()
  @IsOptional()
  utmCampaign?: string;

  @ApiProperty()
  @IsOptional()
  utmContent?: string;

  @ApiProperty()
  @IsOptional()
  utmTerm?: string;

  @ApiProperty()
  @IsOptional()
  referrer?: string;

  @ApiProperty()
  @IsOptional()
  bankAccountName?: string;

  @ApiProperty()
  @IsOptional()
  bankAccountNumber?: string;

  @ApiProperty()
  @IsOptional()
  bankBranchName?: string;

  @ApiProperty()
  @IsOptional()
  bankComment?: string;

  @ApiProperty()
  @IsOptional()
  bankCountryIso?: string;

  @ApiProperty()
  @IsOptional()
  bankName?: string;

  @ApiProperty()
  @IsOptional()
  bankSwiftCode?: string;

  @ApiProperty()
  @IsOptional()
  salesDeskId?: number;

  @ApiProperty()
  @IsOptional()
  salesRepId?: number;

  @ApiProperty()
  @IsOptional()
  internalSalesStatus?: number;

  @ApiProperty()
  @IsOptional()
  clientPotential?: number;

  @ApiProperty()
  @IsOptional()
  auditStatus?: number;

  @ApiProperty()
  @IsOptional()
  firstRetinationRep?: number;

  @ApiProperty()
  @IsOptional()
  retentionDesk?: number;

  @ApiProperty()
  @IsOptional()
  retentionRep?: number;

  @ApiProperty()
  @IsOptional()
  internalRetentionStatus?: number;

  @ApiProperty()
  @IsOptional()
  secondApplicantFullName?: string;

  @ApiProperty()
  @IsOptional()
  mothersName?: string;

  @ApiProperty()
  @IsOptional()
  countryOfBirth?: string;

  @ApiProperty()
  @IsOptional()
  country?: string;

  @ApiProperty()
  @IsOptional()
  countryOfResidence?: string;

  @ApiProperty()
  @IsOptional()
  language?: string;

  @ApiProperty()
  @IsOptional()
  secondPrefix?: string;

  @ApiProperty()
  @IsOptional()
  secondTelephone?: string;

  @ApiProperty()
  @IsOptional()
  skype?: string;

  @ApiProperty()
  @IsOptional()
  drivingLicenseNumber?: string;

  @ApiProperty()
  @IsOptional()
  idPassportNumber?: string;

  @ApiProperty()
  @IsOptional()
  ssnTinNumber?: string;

  @ApiProperty()
  @IsOptional()
  nationality?: string;

  @ApiProperty()
  @IsOptional()
  gender?: string;

  @ApiProperty()
  @IsOptional()
  countrySpecificIdentifier?: string;

  @ApiProperty()
  @IsOptional()
  countrySpecificIdentifierType?: string;

  @ApiProperty()
  @IsOptional()
  addressStreetName?: string;

  @ApiProperty()
  @IsOptional()
  postalCode?: string;

  @ApiProperty()
  @IsOptional()
  houseNo?: string;

  @ApiProperty()
  @IsOptional()
  kycNote?: string;

  @ApiProperty()
  @IsOptional()
  dualCitizenship?: string;

  @ApiProperty()
  @IsOptional()
  countryOfCitizenship?: string;

  @ApiProperty()
  @IsOptional()
  type?: string;

  @ApiProperty()
  @IsOptional()
  abuseReason?: string;

  @ApiProperty()
  @IsOptional()
  price?: string;

  @ApiProperty()
  @IsOptional()
  brokerName?: string;

  @ApiProperty()
  @IsOptional()
  liquidAssets?: string;
}
