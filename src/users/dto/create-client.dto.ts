import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities/role.entity';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  Validate,
} from 'class-validator';
import { Status } from '../../statuses/entities/status.entity';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';
import { FileEntity } from '../../files/entities/file.entity';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateClientDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @Validate(IsNotExist, ['User'], {
    message: i18nValidationMessage('errors.auth.emailExists'),
  })
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  email: string | null;

  @ApiProperty()
  @MinLength(6, { message: i18nValidationMessage('validation.MIN') })
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  firstName: string | null;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  lastName: string | null;

  @ApiProperty({ type: () => FileEntity })
  @IsOptional()
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: i18nValidationMessage('errors.client.imageExist'),
  })
  photo?: FileEntity | null;

  @ApiProperty({ type: Role })
  @Validate(IsExist, ['Role', 'id'], {
    message: i18nValidationMessage('errors.client.roleNotExist'),
  })
  role?: Role | null;

  @ApiProperty({ type: Status })
  @Validate(IsExist, ['Status', 'id'], {
    message: i18nValidationMessage('errors.client.statusNotExist'),
  })
  status?: Status;

  @ApiProperty()
  bankAccountName?: string;

  @ApiProperty()
  bankAccountNumber?: string;

  @ApiProperty()
  bankBranchName?: string;

  @ApiProperty()
  bankComment?: string;

  @ApiProperty()
  bankCountryIso?: string;

  @ApiProperty()
  bankName?: string;

  @ApiProperty()
  bankSwiftCode?: string;

  @ApiProperty()
  salesDeskId?: number;

  @ApiProperty()
  salesRepId?: number;

  @ApiProperty()
  internalSalesStatus?: number;

  @ApiProperty()
  clientPotential?: number;

  @ApiProperty()
  auditStatus?: number;

  @ApiProperty()
  firstRetinationRep?: number;

  @ApiProperty()
  retentionDesk?: number;

  @ApiProperty()
  retentionRep?: number;

  @ApiProperty()
  internalRetentionStatus?: number;

  @ApiProperty()
  secondApplicantFullName?: string;

  @ApiProperty()
  mothersName?: string;

  @ApiProperty()
  countryOfBirth?: string;

  @ApiProperty()
  country?: string;

  @ApiProperty()
  countryOfResidence?: string;

  @ApiProperty()
  language?: string;

  @ApiProperty()
  secondPrefix?: string;

  @ApiProperty()
  secondTelephone?: string;

  @ApiProperty()
  skype?: string;

  @ApiProperty()
  drivingLicenseNumber?: string;

  @ApiProperty()
  idPassportNumber?: string;

  @ApiProperty()
  ssnTinNumber?: string;

  @ApiProperty()
  nationality?: string;

  @ApiProperty()
  gender?: string;

  @ApiProperty()
  countrySpecificIdentifier?: string;

  @ApiProperty()
  countrySpecificIdentifierType?: string;

  @ApiProperty()
  addressStreetName?: string;

  @ApiProperty()
  postalCode?: string;

  @ApiProperty()
  houseNo?: string;

  @ApiProperty()
  kycNote?: string;

  @ApiProperty()
  dualCitizenship?: string;

  @ApiProperty()
  countryOfCitizenship?: string;

  @ApiProperty()
  type?: string;

  @ApiProperty()
  abuseReason?: string;

  @ApiProperty()
  price?: string;

  @ApiProperty()
  brokerName?: string;

  @ApiProperty()
  liquidAssets?: string;

  @ApiProperty()
  userLifeCycle?: string;
  
  fullName?: string;
}
