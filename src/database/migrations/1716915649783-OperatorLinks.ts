import { MigrationInterface, QueryRunner } from 'typeorm';

export class OperatorLinks1716915649783 implements MigrationInterface {
  name = 'OperatorLinks1716915649783';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "operator_links" ("id" int NOT NULL IDENTITY(1,1), "creationTime" datetime, "lastUpdateTime" datetime, "name" text, "languageIso" text, "secondaryUrl" text, "url" text, "urlWithParams" text, "urlForPreview" text, "description" text, "appId" int, "published" bit, "appDisplayName" text, "brokerIds" int, "isRegulated" bit, "isAmpersandForbidden" bit, "replaceInsteadOfAdd" bit, "detailsImageUrl" text, "lineViewImageUrl" text, "badge" nvarchar(255), "sort" int, "category" text, "subCategory" text, "assetsUrl" text, "commission" int, "commissionCurrency" text, "commissionType" text, "customVisitId" text, "commissionTerms" text, "restrictions" text, "promoMethods" text, "appBlockedCountries" text, "requirements" text, "ipWhitelist" text, "allowedOrigins" text, "redirectAfterPixel" text, "bypassIpWhitelist" bit, "checkOrigin" bit, "allowedReferrer" text, "checkReferrer" bit, "isKilled" bit, "imageUrl" text, CONSTRAINT "PK_1e2840ed49c03b8a64966166286" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "operator_links"`);
  }
}
