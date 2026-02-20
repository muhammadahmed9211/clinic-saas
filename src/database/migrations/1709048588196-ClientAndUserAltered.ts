import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientAndUserAltered1709048588196 implements MigrationInterface {
  name = 'ClientAndUserAltered1709048588196';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_5eb4669aabe6a242d6b3f6a960" ON "user"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "p1"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isClient" bit NOT NULL CONSTRAINT "DF_cd96e1363948559f07adabd9b8d" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isOperator" bit NOT NULL CONSTRAINT "DF_0419d31614356730e5032a8bc15" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isPartner" bit NOT NULL CONSTRAINT "DF_22fbfd0258062eab6e703b6865e" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "registrationNotes" text`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "p1" text`);
    await queryRunner.query(`ALTER TABLE "client" ADD "p2" text`);
    await queryRunner.query(`ALTER TABLE "client" ADD "p3" text`);
    await queryRunner.query(`ALTER TABLE "client" ADD "p4" text`);
    await queryRunner.query(`ALTER TABLE "client" ADD "p5" text`);
    await queryRunner.query(`ALTER TABLE "client" ADD "p6" text`);
    await queryRunner.query(`ALTER TABLE "client" ADD "visitId" text`);
    await queryRunner.query(`ALTER TABLE "client" ADD "userAgent" text`);
    await queryRunner.query(`ALTER TABLE "client" ADD "referral" text`);
    await queryRunner.query(`ALTER TABLE "client" ADD "queryString" text`);
    await queryRunner.query(`ALTER TABLE "client" ADD "rootExternalId" text`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "dstTimeZoneoffset" text`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "isBlockEmails" text`);
    await queryRunner.query(`ALTER TABLE "client" ADD "utmSource" text`);
    await queryRunner.query(`ALTER TABLE "client" ADD "utmMedium" text`);
    await queryRunner.query(`ALTER TABLE "client" ADD "utmCampaign" text`);
    await queryRunner.query(`ALTER TABLE "client" ADD "utmContent" text`);
    await queryRunner.query(`ALTER TABLE "client" ADD "utmTerm" text`);
    await queryRunner.query(`ALTER TABLE "client" ADD "referrer" text`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "bankAccount_name" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "bankAccount_number" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "bankBranch_name" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "bankComment" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "bankCountryIso" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "bankName" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "bankSwiftCode" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "salesDeskId" int CONSTRAINT "DF_2a7a4a476922ad985539ade4962" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "salesRepId" int CONSTRAINT "DF_0f5c8966c2278b5afedbb692d46" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "internalSalesStatus" int CONSTRAINT "DF_ee77d0dd324463bf84b951ff4af" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "clientPotential" int CONSTRAINT "DF_3d93741106b0d1deb3f11496aeb" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "auditStatus" int CONSTRAINT "DF_29ac06bb857e62d762950546999" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "firstRetinationRep" int CONSTRAINT "DF_3ebafa70de4261bf4b7734e0a07" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "retentionDesk" int CONSTRAINT "DF_d57a8bbee44d5e7b0938ee6bd7c" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "retentionRep" int CONSTRAINT "DF_9368013cea77e433cbfad71134f" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "internalRetentionStatus" int CONSTRAINT "DF_8d34c5f89d637582108be9a3a05" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "secondApplicantFullName" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "mothersName" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "countryOfBirth" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "country" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "countryOfResidence" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "language" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "secondPrefix" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "secondTelephone" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "skype" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "drivingLicenseNumber" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "idPassportNumber" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "ssnTinNumber" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "nationality" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "gender" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "countrySpecificIdentifier" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "countrySpecificIdentifierType" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "addressStreetName" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "postalCode" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "houseNo" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "dualCitizenship" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "countryOfCitizenship" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "type" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "abuseReason" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "price" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "brokerName" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "liquidAssets" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "liquidAssets"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "brokerName"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "price"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "abuseReason"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "type"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "countryOfCitizenship"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "dualCitizenship"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "houseNo"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "postalCode"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "addressStreetName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "countrySpecificIdentifierType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "countrySpecificIdentifier"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "gender"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "nationality"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "ssnTinNumber"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "idPassportNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "drivingLicenseNumber"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "skype"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "secondTelephone"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "secondPrefix"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "language"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "countryOfResidence"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "country"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "countryOfBirth"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "mothersName"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "secondApplicantFullName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_8d34c5f89d637582108be9a3a05"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "internalRetentionStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_9368013cea77e433cbfad71134f"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "retentionRep"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_d57a8bbee44d5e7b0938ee6bd7c"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "retentionDesk"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_3ebafa70de4261bf4b7734e0a07"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "firstRetinationRep"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_29ac06bb857e62d762950546999"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "auditStatus"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_3d93741106b0d1deb3f11496aeb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "clientPotential"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_ee77d0dd324463bf84b951ff4af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "internalSalesStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_0f5c8966c2278b5afedbb692d46"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "salesRepId"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_2a7a4a476922ad985539ade4962"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "salesDeskId"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "bankSwiftCode"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "bankName"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "bankCountryIso"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "bankComment"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "bankBranch_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "bankAccount_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "bankAccount_name"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "referrer"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "utmTerm"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "utmContent"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "utmCampaign"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "utmMedium"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "utmSource"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "isBlockEmails"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "dstTimeZoneoffset"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "rootExternalId"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "queryString"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "referral"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "userAgent"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "visitId"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "p6"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "p5"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "p4"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "p3"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "p2"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "p1"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "registrationNotes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_22fbfd0258062eab6e703b6865e"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isPartner"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_0419d31614356730e5032a8bc15"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isOperator"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_cd96e1363948559f07adabd9b8d"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isClient"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "p1" nvarchar(255)`);
    await queryRunner.query(
      `CREATE INDEX "IDX_5eb4669aabe6a242d6b3f6a960" ON "user" ("p1") `,
    );
  }
}
