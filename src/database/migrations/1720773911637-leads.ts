import { MigrationInterface, QueryRunner } from 'typeorm';

export class Leads1720773911637 implements MigrationInterface {
  name = 'Leads1720773911637';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lead" ("id" int NOT NULL IDENTITY(1,1), "leadOwner" varchar(255), "title" varchar(255), "typeOfBusiness" varchar(255), "noOfLocations" varchar(255), "fax" varchar(255), "phoneNumber" varchar(255), "mobileNumber" varchar(255), "leadSource" varchar(255), "industury" varchar(255), "annualOptOut" varchar(255), "emailOptOut" varchar(255), "modifiedBy" varchar(255), "companyName" varchar(255), "firstName" varchar(255), "lastName" varchar(255), "email" varchar(255), "website" varchar(255), "leadStatus" varchar(255), "noOfEmployees" varchar(255), "rating" varchar(255), "createdBy" varchar(255), "skypeID" varchar(255), "secondaryEmail" varchar(255), "twitter" varchar(255), "streetAddress" varchar(255), "state" varchar(255), "addresssLastName" varchar(255), "city" varchar(255), "zipCode" varchar(255), "addressNoOfLocations" varchar(255), "infoStreet" varchar(255), "affiliate" varchar(255), "vistID" varchar(255), "source" varchar(255), "customParam1" varchar(255), "customParam2" varchar(255), "customParam3" varchar(255), "registrationDate" datetime, "registrationDevice" varchar(255), "registrationIP" varchar(255), "lastCommunication" datetime, "lastUpdate" datetime, "umtSource" varchar(255), "umtCampaign" varchar(255), "umtTerm" varchar(255), "umtMedium" varchar(255), "umtContent" varchar(255), "compaignID" varchar(255), "createdAt" datetime NOT NULL CONSTRAINT "DF_85ffef84b3514009bea7656f08f" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_c98adb4d29dbaec2875ecfda9f3" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_ca96c1888f7dcfccab72b72fffa" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "lead"`);
  }
}
