import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedPSPTranscationIdInTranscationTable1716195885678
  implements MigrationInterface
{
  name = 'AddedPSPTranscationIdInTranscationTable1716195885678';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "pspTransactionId" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "internalReferenceNo" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "tradingPlatformId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_8c48658c382b87c119b6a55a66e" FOREIGN KEY ("tradingPlatformId") REFERENCES "mt5_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "pspTransactionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_8c48658c382b87c119b6a55a66e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "tradingPlatformId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "internalReferenceNo"`,
    );
  }
}
