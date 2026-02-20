import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientSettings1709306692542 implements MigrationInterface {
  name = 'ClientSettings1709306692542';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_f490242155c66331f56cbce0077"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "testUserMode"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_ac4d482399109516d19fa4ff414"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isPhoneValid"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_b9aff65d7c8ebc6fed5324c59fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isSecondPhoneValid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_329110f9de35bf295273a068e81"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isEmailConfirmed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_09c882b776ccaddf8c3052bb9ba"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isUserConverted"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_1fa63d87a16a7575e7faabae650"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isProTrader"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_b073fbe341fd3aae73891e61fc7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isShowInvestments"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_e16b0ac0ca7b7081ea2d5d9d891"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isAutomaticTransfer"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_b3a79e1bf2c103d14242287003e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isAllowTransactions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_878e0202275dd03c70549ee0a6b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isSuspiciousUser"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_a1b339d9384b7d121c01ae17f57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isBlockAllCommunications"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_439190f3e49ef06118452750065"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isBlockSendingEmails"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_42bb28c183c53d48a304d55e758"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isProblematicClient"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_760e6f2a18b4f31e2dabf166ca8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isBlockClientArea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_ad0f295fdd523447c27678c8251"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isBonusAbuser"`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "testUserMode" bit NOT NULL CONSTRAINT "DF_fcaf768ca59262222161bc3eae6" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isPhoneValid" bit NOT NULL CONSTRAINT "DF_899a1e294eaceb5855201d6c111" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isSecondPhoneValid" bit NOT NULL CONSTRAINT "DF_998d3d6801d54e0a90b3810bf83" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isEmailConfirmed" bit NOT NULL CONSTRAINT "DF_e3cc11f78a0866b8cbbd8c5e635" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isUserConverted" bit NOT NULL CONSTRAINT "DF_47010eb0cf0160dba499773d200" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isProTrader" bit NOT NULL CONSTRAINT "DF_492fd2a8cdf06ae29293edecd9a" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isShowInvestments" bit NOT NULL CONSTRAINT "DF_c73f646b1b36c0068034dcdf2d6" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isAutomaticTransfer" bit NOT NULL CONSTRAINT "DF_01132c4d68de7a1d41aaedaabf2" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isAllowTransactions" bit NOT NULL CONSTRAINT "DF_80e8711575680c187a8113ce9b9" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isSuspiciousUser" bit NOT NULL CONSTRAINT "DF_33155bebb97ed118b670c7405c0" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isBlockAllCommunications" bit NOT NULL CONSTRAINT "DF_316ded4dfcb5fc0cb5074ca3616" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isBlockSendingEmails" bit NOT NULL CONSTRAINT "DF_ac0adea05186b9e18b6b3c483bc" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isProblematicClient" bit NOT NULL CONSTRAINT "DF_2511757fa8e261f7e81400ceaf7" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isBlockClientArea" bit NOT NULL CONSTRAINT "DF_42939771269e7e360dd5739edd2" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isBonusAbuser" bit NOT NULL CONSTRAINT "DF_bb3a2e35e31aa1b0663cd3b3ee3" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_bb3a2e35e31aa1b0663cd3b3ee3"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "isBonusAbuser"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_42939771269e7e360dd5739edd2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "isBlockClientArea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_2511757fa8e261f7e81400ceaf7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "isProblematicClient"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_ac0adea05186b9e18b6b3c483bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "isBlockSendingEmails"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_316ded4dfcb5fc0cb5074ca3616"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "isBlockAllCommunications"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_33155bebb97ed118b670c7405c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "isSuspiciousUser"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_80e8711575680c187a8113ce9b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "isAllowTransactions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_01132c4d68de7a1d41aaedaabf2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "isAutomaticTransfer"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_c73f646b1b36c0068034dcdf2d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "isShowInvestments"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_492fd2a8cdf06ae29293edecd9a"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "isProTrader"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_47010eb0cf0160dba499773d200"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "isUserConverted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_e3cc11f78a0866b8cbbd8c5e635"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "isEmailConfirmed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_998d3d6801d54e0a90b3810bf83"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "isSecondPhoneValid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_899a1e294eaceb5855201d6c111"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "isPhoneValid"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_fcaf768ca59262222161bc3eae6"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "testUserMode"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isBonusAbuser" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_ad0f295fdd523447c27678c8251" DEFAULT 0 FOR "isBonusAbuser"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isBlockClientArea" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_760e6f2a18b4f31e2dabf166ca8" DEFAULT 0 FOR "isBlockClientArea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isProblematicClient" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_42bb28c183c53d48a304d55e758" DEFAULT 0 FOR "isProblematicClient"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isBlockSendingEmails" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_439190f3e49ef06118452750065" DEFAULT 0 FOR "isBlockSendingEmails"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isBlockAllCommunications" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_a1b339d9384b7d121c01ae17f57" DEFAULT 0 FOR "isBlockAllCommunications"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isSuspiciousUser" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_878e0202275dd03c70549ee0a6b" DEFAULT 0 FOR "isSuspiciousUser"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isAllowTransactions" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_b3a79e1bf2c103d14242287003e" DEFAULT 0 FOR "isAllowTransactions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isAutomaticTransfer" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_e16b0ac0ca7b7081ea2d5d9d891" DEFAULT 0 FOR "isAutomaticTransfer"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isShowInvestments" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_b073fbe341fd3aae73891e61fc7" DEFAULT 0 FOR "isShowInvestments"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isProTrader" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_1fa63d87a16a7575e7faabae650" DEFAULT 0 FOR "isProTrader"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isUserConverted" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_09c882b776ccaddf8c3052bb9ba" DEFAULT 0 FOR "isUserConverted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isEmailConfirmed" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_329110f9de35bf295273a068e81" DEFAULT 0 FOR "isEmailConfirmed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isSecondPhoneValid" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_b9aff65d7c8ebc6fed5324c59fc" DEFAULT 0 FOR "isSecondPhoneValid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isPhoneValid" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_ac4d482399109516d19fa4ff414" DEFAULT 0 FOR "isPhoneValid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "testUserMode" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_f490242155c66331f56cbce0077" DEFAULT 0 FOR "testUserMode"`,
    );
  }
}
