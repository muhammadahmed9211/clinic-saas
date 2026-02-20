import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartnerUpdated1716385107026 implements MigrationInterface {
  name = 'PartnerUpdated1716385107026';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "partner" ("id" int NOT NULL IDENTITY(1,1), "title" nvarchar(255) NOT NULL, "name" nvarchar(255) NOT NULL, "contactName" nvarchar(255) NOT NULL, "email" nvarchar(255) NOT NULL, "password" nvarchar(255) NOT NULL, "telephone" nvarchar(255) NOT NULL, "countryId" int NOT NULL, "skype" nvarchar(255), "platformId" int, "regulated" bit, "ib" bit, "referrerId" int, "affiliateManagerId" int, "appId" int, "referralPercentage" int, "dailyCount" int, "dailyLimit" int, "minDepositAmount" int, "userIbId" int, "blockedCountriesId" int, "allowedCountriesId" int, "registrationNotes" nvarchar(255), "bypassIpWhitelist" bit, "onlyShowFtds" bit, "apiWhitelistIps" nvarchar(255), "blockedSources" nvarchar(255), "trackVisit" bit, "registerUser" bit, "registerLead" bit, "getUser" bit, "getDeposits" bit, "getStats" bit, "getSalesStatuses" bit, "getDeposit" bit, "syncUserTransaction" bit, "syncUserNote" bit, "regenerateUserAutologinUrl" bit, "getUserClosedTrades" bit, "getWithdrawal" bit, "createAffiliate" bit, "editAffiliate" bit, "getAffiliate" bit, "created_at" datetime2 NOT NULL CONSTRAINT "DF_192d072f322b9ad0883b5c0dbf2" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_7a8762f26a23a4ef91a566888be" DEFAULT getdate(), CONSTRAINT "PK_8f34ff11ddd5459eacbfacd48ca" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "partner"`);
  }
}
