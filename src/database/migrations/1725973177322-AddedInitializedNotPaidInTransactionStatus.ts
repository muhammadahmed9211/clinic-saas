import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedInitializedNotPaidInTransactionStatus1725973177322
  implements MigrationInterface
{
  name = 'AddedInitializedNotPaidInTransactionStatus1725973177322';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "CHK_ba0d6852dce968510405c9035b_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "CHK_364d8e83f2db923c9b66b5cf80_ENUM" CHECK (status IN ('IDLE','NEW','INITIALIZED','INITIALIZED_NOT_PAID','APPROVED','FAILED','REJECTED','RECEIVED','PENDING','PROCESSED','APPROVED_ON_HOLD','CANCELLED','COMPLETED'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "CHK_ba0d6852dce968510405c9035b_ENUM" CHECK (status IN ('IDLE','NEW','INITIALIZED','APPROVED','FAILED','REJECTED','RECEIVED','PENDING','PROCESSED','APPROVED_ON_HOLD','CANCELLED','COMPLETED'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "CHK_364d8e83f2db923c9b66b5cf80_ENUM"`,
    );
  }
}
