import { MigrationInterface, QueryRunner } from 'typeorm';

export class TranscationStatusEnumAdded1716535044581
  implements MigrationInterface
{
  name = 'TranscationStatusEnumAdded1716535044581';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "CHK_80a553c673455bb32521bd431c_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "CHK_ba0d6852dce968510405c9035b_ENUM" CHECK (status IN ('IDLE','NEW','INITIALIZED','APPROVED','FAILED','REJECTED','RECEIVED','PENDING','PROCESSED','APPROVED_ON_HOLD','CANCELLED','COMPLETED'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "CHK_80a553c673455bb32521bd431c_ENUM" CHECK (status IN ('IDLE','INITIALIZED','APPROVED','FAILED','RECEIVED','PENDING','REJECTED','PROCESSED','APPROVED_ON_HOLD','CANCELLED','COMPLETED'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "CHK_ba0d6852dce968510405c9035b_ENUM"`,
    );
  }
}
