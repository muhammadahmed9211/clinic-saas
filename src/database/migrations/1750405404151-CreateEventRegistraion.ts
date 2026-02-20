import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEventRegistraion1750405404151 implements MigrationInterface {
    name = 'CreateEventRegistraion1750405404151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "event_registration" ("id" int NOT NULL IDENTITY(1, 1), "firstName" nvarchar(255), "lastName" nvarchar(255), "email" varchar(255), "country" nvarchar(255), "countryIso" nvarchar(255), "phoneNumber" nvarchar(255), "telephone" nvarchar(255), "telephonePrefix" nvarchar(255), "eventType" nvarchar(255), "eventName" nvarchar(255), "eventStartDate" datetime, "eventEndDate" datetime, "eventStartTime" nvarchar(255), "eventEndTime" nvarchar(255), "source" nvarchar(255), "utmSource" nvarchar(255), "utmCampaign" nvarchar(255), "utmContent" nvarchar(255), "utmMedium" nvarchar(255), "utmTerm" nvarchar(255), "campaignId" nvarchar(255), "languageIso" nvarchar(10), "question" nvarchar(MAX), "createdAt" datetime NOT NULL CONSTRAINT "DF_aae0bae45f514446629acfdc87d" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_0a7d2e726b86b75bcfcb1ebb2eb" DEFAULT getdate(), "deletedAt" datetime2, "isActive" bit NOT NULL CONSTRAINT "DF_f8662573e76cb06214856e2d09f" DEFAULT 1, CONSTRAINT "PK_10aedff1bd0d0ef534d1106ddec" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "event_registration"`);
    }

}
