import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatLeadTable1722526006995 implements MigrationInterface {
  name = 'CreatLeadTable1722526006995';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_f623eeea6f0bede7c9dfe1d7657"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "CHK_784b14dd7a498de07bdcc26bcc"`,
    );
    await queryRunner.query(
      `CREATE TABLE "lead" ("id" int NOT NULL IDENTITY(1,1), "leadOwner" varchar(255), "title" varchar(255), "typeOfBusiness" varchar(255), "noOfLocations" varchar(255), "fax" varchar(255), "phoneNumber" varchar(255), "mobile" varchar(255), "leadSource" varchar(255), "industury" varchar(255), "annualOptOut" varchar(255), "emailOptOut" varchar(255), "modifiedBy" varchar(255), "companyName" varchar(255), "firstName" varchar(255), "lastName" varchar(255), "email" varchar(255), "website" varchar(255), "noOfEmployees" varchar(255), "rating" varchar(255), "createdBy" varchar(255), "skypeID" varchar(255), "secondaryEmail" varchar(255), "twitter" varchar(255), "streetAddress" varchar(255), "state" varchar(255), "addresssLastName" varchar(255), "city" varchar(255), "zipCode" varchar(255), "addressNoOfLocations" varchar(255), "infoStreet" varchar(255), "affiliate" varchar(255), "vistID" varchar(255), "source" varchar(255), "p1" varchar(255), "p2" varchar(255), "p3" varchar(255), "p4" varchar(255), "p5" varchar(255), "p6" varchar(255), "registrationDate" datetime, "registrationDevice" varchar(255), "registrationIP" varchar(255), "lastCommunication" datetime, "lastUpdate" datetime, "utmSource" varchar(255), "utmCampaign" varchar(255), "utmTerm" varchar(255), "utmMedium" varchar(255), "utmContent" varchar(255), "campaignID" varchar(255), "clientID" varchar(255), "leadGrading" varchar(255), "designation" varchar(255), "expectedInvestment" varchar(255), "country" varchar(255), "language" varchar(255), "referral" varchar(255), "localTime" varchar(255), "preferredTime" varchar(255), "dateOfBirth" datetime, "salesManager" varchar(255), "userLifeCycle" varchar(255) CONSTRAINT "DF_ae37892ae5e3a2ec506a5d312f0" DEFAULT 'lead', "appRegistration" nvarchar(255), "appsFlyerId" int, "queryString" text, "affiliateLinkUrl" nvarchar(255), "affiliateLinkId" int, "externalId" nvarchar(255), "ip" nvarchar(255), "creationTime" datetime, "tracking" nvarchar(255), "clickId" int, "createdAt" datetime NOT NULL CONSTRAINT "DF_85ffef84b3514009bea7656f08f" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_c98adb4d29dbaec2875ecfda9f3" DEFAULT getdate(), "deletedAt" datetime2, "salesDeskId" bigint, "salesRepId" bigint, "salesPartnerId" int, "salesOfficeId" bigint, "lead" int, "sales" int, CONSTRAINT "CHK_1011d24a46a0f7c866b9a2cadd" CHECK ("userLifeCycle" IN ('lead', 'registered', 'applicant', 'client')), CONSTRAINT "PK_ca96c1888f7dcfccab72b72fffa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "CHK_4f29ae7d1fd6270d1669ec079d" CHECK ("userLifeCycle" IN ('lead', 'registered', 'applicant', 'client'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "opportunity" ADD CONSTRAINT "FK_c5a25a745e25f5cc18a5ab8c41f" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" ADD CONSTRAINT "FK_58759ae11d403ec1ceb76153a5c" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "meetings" ADD CONSTRAINT "FK_06ab1cbf2f97a3d953c0167e1d4" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_f623eeea6f0bede7c9dfe1d7657" FOREIGN KEY ("call_id") REFERENCES "leads_call_log"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_e2da26cfd97f7b99b7df5d6389e" FOREIGN KEY ("lead_id") REFERENCES "lead"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_answer" ADD CONSTRAINT "FK_fd41f93a68de1366537cbe4ced5" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "FK_ce4054e83497831bf6a96fae5cc" FOREIGN KEY ("salesDeskId") REFERENCES "desk"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "FK_3f8b98bc43c090701c984fd0ae5" FOREIGN KEY ("salesRepId") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "FK_2763ed50b7140c311d3a1a9a8da" FOREIGN KEY ("salesPartnerId") REFERENCES "partner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "FK_9bcdcb23d39e8d0cca908a48202" FOREIGN KEY ("salesOfficeId") REFERENCES "office"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "FK_3f9440381f9cb900b025b014cf7" FOREIGN KEY ("lead") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "FK_e8575ccb228b30fdc1d9840b354" FOREIGN KEY ("sales") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "FK_e8575ccb228b30fdc1d9840b354"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "FK_3f9440381f9cb900b025b014cf7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "FK_9bcdcb23d39e8d0cca908a48202"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "FK_2763ed50b7140c311d3a1a9a8da"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "FK_3f8b98bc43c090701c984fd0ae5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "FK_ce4054e83497831bf6a96fae5cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_answer" DROP CONSTRAINT "FK_fd41f93a68de1366537cbe4ced5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_e2da26cfd97f7b99b7df5d6389e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_f623eeea6f0bede7c9dfe1d7657"`,
    );
    await queryRunner.query(
      `ALTER TABLE "meetings" DROP CONSTRAINT "FK_06ab1cbf2f97a3d953c0167e1d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" DROP CONSTRAINT "FK_58759ae11d403ec1ceb76153a5c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opportunity" DROP CONSTRAINT "FK_c5a25a745e25f5cc18a5ab8c41f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads_call_log" DROP CONSTRAINT "FK_2a0ccf83c672fc389383c53669b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "CHK_4f29ae7d1fd6270d1669ec079d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_efe429b8a9a538848586e8c5a11"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "DF_efe429b8a9a538848586e8c5a11" DEFAULT 'lead' FOR "userLifeCycle"`,
    );
    await queryRunner.query(`DROP TABLE "lead"`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "CHK_784b14dd7a498de07bdcc26bcc" CHECK (([userLifeCycle]='client' OR [userLifeCycle]='applicant' OR [userLifeCycle]='registered' OR [userLifeCycle]='lead'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_f623eeea6f0bede7c9dfe1d7657" FOREIGN KEY ("call_id") REFERENCES "leads_call_log"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
