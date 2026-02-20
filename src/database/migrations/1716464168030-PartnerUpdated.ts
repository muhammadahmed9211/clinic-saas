import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartnerUpdated1716464168030 implements MigrationInterface {
  name = 'PartnerUpdated1716464168030';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "getUser"`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "status" nvarchar(255) CONSTRAINT CHK_f057f4d713f43caae3c4aa467c_ENUM CHECK(status IN ('ACTIVE','INACTIVE')) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "partner" ADD "rateLimiting" bit`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "reqPerInterval" bit`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "registerUserRL" bit`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "registerLeadRL" bit`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "getUsers" bit`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "getUsersRL" bit`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "getDepositRL" bit`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "getDepositsRL" bit`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "getStatsRL" bit`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "getSalesStatusesRL" bit`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "salesStatusesReqPerInterval" bit`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "syncUserTransactionRL" bit`,
    );
    await queryRunner.query(`ALTER TABLE "partner" ADD "syncUserNoteRL" bit`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "regenerateUserAutologinUrlRL" bit`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "getUserClosedTradesRL" bit`,
    );
    await queryRunner.query(`ALTER TABLE "partner" ADD "getWithdrawalRL" bit`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "getWithdrawals" bit`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "getWithdrawalsRL" bit`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "getWithdrawalsReqPerInterval" bit`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "createAffiliateRL" bit`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "createAffiliateRL"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "getWithdrawalsReqPerInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "getWithdrawalsRL"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "getWithdrawals"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "getWithdrawalRL"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "getUserClosedTradesRL"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "regenerateUserAutologinUrlRL"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "syncUserNoteRL"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "syncUserTransactionRL"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "salesStatusesReqPerInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "getSalesStatusesRL"`,
    );
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "getStatsRL"`);
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "getDepositsRL"`,
    );
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "getDepositRL"`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "getUsersRL"`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "getUsers"`);
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "registerLeadRL"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "registerUserRL"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "reqPerInterval"`,
    );
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "rateLimiting"`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "getUser" bit`);
  }
}
