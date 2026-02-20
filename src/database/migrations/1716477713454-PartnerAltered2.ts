import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartnerAltered21716477713454 implements MigrationInterface {
  name = 'PartnerAltered21716477713454';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_f813d70a667ca902a0b6b217d8d"`,
    );
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "getUsers"`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "getUsersRL"`);
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "trackReqPerInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "userReqPerInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "leadReqPerInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "salesReqPerInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "depositReqPerInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "withdrawalsReqPerInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "trackVisitRLInterval" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "registerUserRLInterval" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "registerLeadRLInterval" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "getUsersRLInterval" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "getDepositsRLInterval" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "getStatsRLInterval" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "getSalesRLInterval" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "getDepositRLInterval" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "syncUserTransactionRLInterval" int CONSTRAINT "DF_9b67a05ac4a9f261e6ce8555bfa" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "syncUserNoteRInterval" int CONSTRAINT "DF_069007548c8d6e265e61116bdf3" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "regenerateUserAutologinUrlRLInterval" int CONSTRAINT "DF_5c8f8c81cd04f3c34f5478e4af0" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "getUserClosedTradesRLInterval" int CONSTRAINT "DF_af3fe46b2c399004c03d9080406" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "getWithdrawalRLInterval" int CONSTRAINT "DF_2ef6a6527947fbd85ab27b43a00" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "getWithdrawalsRLInterval" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "createAffiliateRLInterval" int CONSTRAINT "DF_4b31f2ffc2c77ae06d70c1e5622" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_4b31f2ffc2c77ae06d70c1e5622"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "createAffiliateRLInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "getWithdrawalsRLInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_2ef6a6527947fbd85ab27b43a00"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "getWithdrawalRLInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_af3fe46b2c399004c03d9080406"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "getUserClosedTradesRLInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_5c8f8c81cd04f3c34f5478e4af0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "regenerateUserAutologinUrlRLInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_069007548c8d6e265e61116bdf3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "syncUserNoteRInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_9b67a05ac4a9f261e6ce8555bfa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "syncUserTransactionRLInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "getDepositRLInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "getSalesRLInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "getStatsRLInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "getDepositsRLInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "getUsersRLInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "registerLeadRLInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "registerUserRLInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "trackVisitRLInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "withdrawalsReqPerInterval" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "depositReqPerInterval" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "salesReqPerInterval" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "leadReqPerInterval" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "userReqPerInterval" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "trackReqPerInterval" int`,
    );
    await queryRunner.query(`ALTER TABLE "partner" ADD "getUsersRL" bit`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "getUsers" bit`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "DF_f813d70a667ca902a0b6b217d8d" DEFAULT 0 FOR "getUsers"`,
    );
  }
}
