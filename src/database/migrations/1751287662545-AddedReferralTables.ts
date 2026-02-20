import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedReferralTables1751287662545 implements MigrationInterface {
  name = 'AddedReferralTables1751287662545';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "referral_program" ("id" int NOT NULL IDENTITY(1,1), "status" nvarchar(255) NOT NULL, "type" nvarchar(255) NOT NULL CONSTRAINT "DF_e4a9dd09436c0cc7f7f88c1848d" DEFAULT 'Single Tier', "image" nvarchar(255) NOT NULL, "code" nvarchar(255) NOT NULL, "reward" int NOT NULL, "rewardType" int NOT NULL CONSTRAINT "DF_6414d4d11d7f8a1b953321c0de5" DEFAULT 'Amount', "maxReferrals" int, "createdAt" datetime NOT NULL CONSTRAINT "DF_3a50e0c813520c4905946ec110d" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_321e35adc35171dcddb0d24c101" DEFAULT getdate(), "deletedAt" datetime2, "titleId" int, "nameId" int, "descriptionId" int, CONSTRAINT "PK_2a48fee0a76a89b91e78d7fe3fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "referral_reward" ("id" int NOT NULL IDENTITY(1,1), "totalEarned" int NOT NULL, "totalWithdraw" int NOT NULL, "balance" int NOT NULL, "version" int NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_13f93e9a7d33df311f0703639dd" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_7fb534a4d8c0ff745a3249f80eb" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_039e9361b7ea8c9a9e500ee6e1e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "referrals" ("id" int NOT NULL IDENTITY(1,1), "referralCode" nvarchar(255) NOT NULL, "referralUuid" nvarchar(255) NOT NULL, "status" nvarchar(255) NOT NULL CONSTRAINT "DF_c2ea4262719c2cb9378e9a697de" DEFAULT 'Registered', "reward" decimal(10,2), "createdAt" datetime NOT NULL CONSTRAINT "DF_f2c72a56af4adb37d59a92b0320" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_2d7fef9acb88bf8b108202dbe8f" DEFAULT getdate(), "deletedAt" datetime2, "referralProgramId" int, "referrerId" int, "referredId" int, CONSTRAINT "PK_ea9980e34f738b6252817326c08" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rule" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "field" nvarchar(255) NOT NULL, "type" nvarchar(255) NOT NULL, "module" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_170ac9f4e38dee625701ef9bd73" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_a1c02725c24a6a4d0e62677736d" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_a5577f464213af7ffbe866e3cb5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rule_criteria" ("id" int NOT NULL IDENTITY(1,1), "operator" nvarchar(255) CONSTRAINT CHK_9bbfa74449f9c1d6de2162a4ed_ENUM CHECK(operator IN ('EQUALS','NOT_EQUAL','GREATER_THAN','GREATER_THAN_OR_EQUAL','LESS_THAN','LESS_THAN_OR_EQUAL','CONTAINS','BETWEEN','IN','NOT_IN','STARTS_WITH','ENDS_WITH')) NOT NULL, "values" text NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_468e29c3ad0f882d159b3584d29" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_49d3ca5fd97aed629ebb1cc8c08" DEFAULT getdate(), "deletedAt" datetime2, "ruleId" int, "groupId" int, CONSTRAINT "PK_dccf8ef29645189083018df08a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rule_group" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "type" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_b21d063f7ec6a39ac8589495f72" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_98c545b75791f01d1154697b42c" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_113625d7d612f0cf76cd01acbae" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "referral_rule" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime NOT NULL CONSTRAINT "DF_4d3840f0f72b37bcc3f56e4a5fb" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_933f0bac217777ee68a9d7b69a5" DEFAULT getdate(), "deletedAt" datetime2, "referralProgramId" int, "ruleGroupId" int, CONSTRAINT "PK_99bb06df76c4811e262a5ceda70" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_program" ADD CONSTRAINT "FK_f5dc43de12ecaa13c99593c1bf1" FOREIGN KEY ("titleId") REFERENCES "label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_program" ADD CONSTRAINT "FK_a9a15e59a9907ce6896293aa4f7" FOREIGN KEY ("nameId") REFERENCES "label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_program" ADD CONSTRAINT "FK_772edb4842ef0cbfea2b24deb48" FOREIGN KEY ("descriptionId") REFERENCES "label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "referrals" ADD CONSTRAINT "FK_e2b789ff3c808422ee7b465ebab" FOREIGN KEY ("referralProgramId") REFERENCES "referral_program"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "referrals" ADD CONSTRAINT "FK_59de462f9ce130da142e3b5a9f4" FOREIGN KEY ("referrerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "referrals" ADD CONSTRAINT "FK_ad6772c3fcb57375f43114b5cb5" FOREIGN KEY ("referredId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_rule" ADD CONSTRAINT "FK_dfe5b520c9a21923acefc1cbfad" FOREIGN KEY ("referralProgramId") REFERENCES "referral_program"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_rule" ADD CONSTRAINT "FK_b765298626c1130b77cefbc475d" FOREIGN KEY ("ruleGroupId") REFERENCES "rule_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rule_criteria" ADD CONSTRAINT "FK_f8b905da3467d03e579c0511cb2" FOREIGN KEY ("ruleId") REFERENCES "rule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rule_criteria" ADD CONSTRAINT "FK_0db48d4405421cc092a92ddd5e7" FOREIGN KEY ("groupId") REFERENCES "rule_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TABLE "referral_reward_ledger" ("id" int NOT NULL IDENTITY(1,1), "amount" int NOT NULL, "totalEarned" int NOT NULL, "totalWithdraw" int NOT NULL, "balance" int NOT NULL, "totalEarnedAfter" int NOT NULL, "totalWithdrawAfter" int NOT NULL, "balanceAfter" int NOT NULL, "version" int NOT NULL, "action" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_7d6249c51df540f659973ec9d3b" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_4ffb2d672fb7b42d81afff54039" DEFAULT getdate(), "deletedAt" datetime2, "referralRewardId" int, "referralsId" int, "transactionId" uniqueidentifier, CONSTRAINT "UQ_e5897f0cd0bb64f57b6a22d4198" UNIQUE ("referralRewardId", "version"), CONSTRAINT "PK_99dce496b1be052f0d828ec72af" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_11368b7d151991f958e6a08f41" ON "referral_reward_ledger" ("referralsId") WHERE "referralsId" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_3a0451cfa0d69c35f4f940120b" ON "referral_reward_ledger" ("transactionId") WHERE "transactionId" IS NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_reward_ledger" ADD CONSTRAINT "FK_2ada3b2fd7616c3b25990bb13cc" FOREIGN KEY ("referralRewardId") REFERENCES "referral_reward"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_reward_ledger" ADD CONSTRAINT "FK_11368b7d151991f958e6a08f410" FOREIGN KEY ("referralsId") REFERENCES "referrals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_reward_ledger" ADD CONSTRAINT "FK_3a0451cfa0d69c35f4f940120b6" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "referral_reward" ADD "userId" int`);
    await queryRunner.query(
      `ALTER TABLE "referral_reward" ADD CONSTRAINT "FK_2ffef22fc829d68eb69e9be8cb6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_reward" ADD CONSTRAINT "UQ_2ffef22fc829d68eb69e9be8cb6" UNIQUE ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_reward" ADD "successful" int NOT NULL CONSTRAINT "DF_ee39cfc660c94b8401fe1dd544f" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_reward" ADD "registered" int NOT NULL CONSTRAINT "DF_bf740e6ffcdbd4e73e8146f1498" DEFAULT 0`,
    );
            await queryRunner.query(`ALTER TABLE "wallet" ADD "rtdAmount" float NOT NULL CONSTRAINT "DF_2db0763cf8a62f9fef6cb19139f" DEFAULT 0`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rule_criteria" DROP CONSTRAINT "FK_0db48d4405421cc092a92ddd5e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rule_criteria" DROP CONSTRAINT "FK_f8b905da3467d03e579c0511cb2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_rule" DROP CONSTRAINT "FK_b765298626c1130b77cefbc475d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_rule" DROP CONSTRAINT "FK_dfe5b520c9a21923acefc1cbfad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "referrals" DROP CONSTRAINT "FK_ad6772c3fcb57375f43114b5cb5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "referrals" DROP CONSTRAINT "FK_59de462f9ce130da142e3b5a9f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "referrals" DROP CONSTRAINT "FK_e2b789ff3c808422ee7b465ebab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_program" DROP CONSTRAINT "FK_772edb4842ef0cbfea2b24deb48"`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_program" DROP CONSTRAINT "FK_a9a15e59a9907ce6896293aa4f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_program" DROP CONSTRAINT "FK_f5dc43de12ecaa13c99593c1bf1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_reward" DROP CONSTRAINT "DF_ee39cfc660c94b8401fe1dd544f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_reward" DROP CONSTRAINT "DF_bf740e6ffcdbd4e73e8146f1498"`,
    );
    await queryRunner.query(`DROP TABLE "referral_rule"`);
    await queryRunner.query(`DROP TABLE "rule_group"`);
    await queryRunner.query(`DROP TABLE "rule_criteria"`);
    await queryRunner.query(`DROP TABLE "rule"`);
    await queryRunner.query(`DROP TABLE "referrals"`);
    await queryRunner.query(`DROP TABLE "referral_reward"`);
    await queryRunner.query(`DROP TABLE "referral_program"`);
    await queryRunner.query(
      `ALTER TABLE "referral_reward_ledger" DROP CONSTRAINT "FK_3a0451cfa0d69c35f4f940120b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_reward_ledger" DROP CONSTRAINT "FK_11368b7d151991f958e6a08f410"`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_reward_ledger" DROP CONSTRAINT "FK_2ada3b2fd7616c3b25990bb13cc"`,
    );
    await queryRunner.query(`DROP TABLE "referral_reward_ledger"`);
  }
}
