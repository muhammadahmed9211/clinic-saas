import { MigrationInterface, QueryRunner } from 'typeorm';

export class LeadEntityUpdate1723191682024 implements MigrationInterface {
  name = 'LeadEntityUpdate1723191682024';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "leadOwner" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "title" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "DF_1059b88ecee4ee90c6ad5be86da" DEFAULT 'Individual Client (IC)' FOR "typeOfBusiness"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "noOfLocations" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "fax" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "phoneNumber" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "mobile" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "leadSource" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "industury" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "annualOptOut" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "emailOptOut" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "modifiedBy" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "companyName" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "firstName" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "lastName" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "website" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "noOfEmployees" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "rating" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "createdBy" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "skypeID" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "secondaryEmail" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "twitter" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "streetAddress" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "state" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "addresssLastName" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "city" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "zipCode" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "addressNoOfLocations" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "infoStreet" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "affiliate" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "vistID" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "source" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "p1" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "p2" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "p3" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "p4" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "p5" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "p6" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "registrationDevice" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "registrationIP" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "utmSource" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "utmCampaign" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "utmTerm" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "utmMedium" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "utmContent" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "campaignID" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "clientID" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "leadGrading" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "designation" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "expectedInvestment" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "country" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "DF_722a8589fc488a4472630dca076" DEFAULT 'United Arab Emirates' FOR "country"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "countryIso" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "DF_7c92955a23696c704de8e6f2e06" DEFAULT 'AE' FOR "countryIso"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "language" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "referral" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "localTime" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "preferredTime" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "preferredTime" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "localTime" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "referral" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "language" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "countryIso" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "country" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "expectedInvestment" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "designation" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "leadGrading" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "clientID" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "campaignID" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "utmContent" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "utmMedium" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "utmTerm" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "utmCampaign" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "utmSource" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "registrationIP" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "registrationDevice" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "p6" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "p5" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "p4" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "p3" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "p2" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "p1" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "source" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "vistID" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "affiliate" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "infoStreet" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "addressNoOfLocations" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "zipCode" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "city" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "addresssLastName" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "state" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "streetAddress" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "twitter" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "secondaryEmail" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "skypeID" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "createdBy" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "rating" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "noOfEmployees" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "website" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "lastName" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "firstName" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "companyName" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "modifiedBy" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "emailOptOut" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "annualOptOut" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "industury" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "leadSource" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "mobile" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "phoneNumber" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "fax" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "noOfLocations" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "typeOfBusiness" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "title" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ALTER COLUMN "leadOwner" varchar(255)`,
    );
  }
}
