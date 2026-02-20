import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionTableAltered1709488507040
  implements MigrationInterface
{
  name = 'TransactionTableAltered1709488507040';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "workflowStatus" nvarchar(255) CONSTRAINT CHK_0e6d84d85132e3e68f86ad4512_ENUM CHECK(workflowStatus IN ('NEW','OPEN','IN_PROGRESS','CLOSED','CLOSED_BY_CLIENT','AWAITING_AGENT','AWAITING_CLIENT')) NOT NULL CONSTRAINT "DF_f9b21db8c8d731070bbc9745450" DEFAULT 'NEW'`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "priority" nvarchar(255) CONSTRAINT CHK_8b700af075b5f53999db8e0ff2_ENUM CHECK(priority IN ('LOW','MEDIUM','HIGH')) NOT NULL CONSTRAINT "DF_f61f940922ffb14915c30036a17" DEFAULT 'MEDIUM'`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "kycStatus" varchar(255) NOT NULL CONSTRAINT "DF_987ddc3d9f7d064a77095c3308e" DEFAULT 'NONE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "fee" float NOT NULL CONSTRAINT "DF_7abe3c74f4b57322b5521d3004a" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "internalDeclineReason" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "salesRep" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "salesDesk" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "retentionRep" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "retentionDesk" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "pspNameManual" varchar(15)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "acquisitionStatus" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "creditBonus" float`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "balanceBonus" float`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" ADD "userReason" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" ADD "transactionReason" varchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "balanceBonus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "creditBonus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "acquisitionStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "pspNameManual"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "retentionDesk"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "retentionRep"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "salesDesk"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "salesRep"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "internalDeclineReason"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "DF_7abe3c74f4b57322b5521d3004a"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "fee"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "DF_987ddc3d9f7d064a77095c3308e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "kycStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "DF_f61f940922ffb14915c30036a17"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "priority"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "DF_f9b21db8c8d731070bbc9745450"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "workflowStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" DROP COLUMN "transactionReason"`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" DROP COLUMN "userReason"`,
    );
  }
}
