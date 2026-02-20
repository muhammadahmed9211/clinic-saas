import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserTableAltered1709235914699 implements MigrationInterface {
  name = 'UserTableAltered1709235914699';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "testUserMode" bit NOT NULL CONSTRAINT "DF_f490242155c66331f56cbce0077" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isPhoneValid" bit NOT NULL CONSTRAINT "DF_ac4d482399109516d19fa4ff414" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isSecondPhoneValid" bit NOT NULL CONSTRAINT "DF_b9aff65d7c8ebc6fed5324c59fc" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isEmailConfirmed" bit NOT NULL CONSTRAINT "DF_329110f9de35bf295273a068e81" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isUserConverted" bit NOT NULL CONSTRAINT "DF_09c882b776ccaddf8c3052bb9ba" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isProTrader" bit NOT NULL CONSTRAINT "DF_1fa63d87a16a7575e7faabae650" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isShowInvestments" bit NOT NULL CONSTRAINT "DF_b073fbe341fd3aae73891e61fc7" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isAutomaticTransfer" bit NOT NULL CONSTRAINT "DF_e16b0ac0ca7b7081ea2d5d9d891" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isAllowTransactions" bit NOT NULL CONSTRAINT "DF_b3a79e1bf2c103d14242287003e" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isSuspiciousUser" bit NOT NULL CONSTRAINT "DF_878e0202275dd03c70549ee0a6b" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isBlockAllCommunications" bit NOT NULL CONSTRAINT "DF_a1b339d9384b7d121c01ae17f57" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isBlockSendingEmails" bit NOT NULL CONSTRAINT "DF_439190f3e49ef06118452750065" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isProblematicClient" bit NOT NULL CONSTRAINT "DF_42bb28c183c53d48a304d55e758" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isBlockClientArea" bit NOT NULL CONSTRAINT "DF_760e6f2a18b4f31e2dabf166ca8" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isBonusAbuser" bit NOT NULL CONSTRAINT "DF_ad0f295fdd523447c27678c8251" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_ad0f295fdd523447c27678c8251"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isBonusAbuser"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_760e6f2a18b4f31e2dabf166ca8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isBlockClientArea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_42bb28c183c53d48a304d55e758"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isProblematicClient"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_439190f3e49ef06118452750065"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isBlockSendingEmails"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_a1b339d9384b7d121c01ae17f57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isBlockAllCommunications"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_878e0202275dd03c70549ee0a6b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isSuspiciousUser"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_b3a79e1bf2c103d14242287003e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isAllowTransactions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_e16b0ac0ca7b7081ea2d5d9d891"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isAutomaticTransfer"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_b073fbe341fd3aae73891e61fc7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isShowInvestments"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_1fa63d87a16a7575e7faabae650"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isProTrader"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_09c882b776ccaddf8c3052bb9ba"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isUserConverted"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_329110f9de35bf295273a068e81"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isEmailConfirmed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_b9aff65d7c8ebc6fed5324c59fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isSecondPhoneValid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_ac4d482399109516d19fa4ff414"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isPhoneValid"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_f490242155c66331f56cbce0077"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "testUserMode"`);
  }
}
