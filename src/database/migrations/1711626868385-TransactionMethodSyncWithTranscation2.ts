import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionMethodSyncWithTranscation21711626868385
  implements MigrationInterface
{
  name = 'TransactionMethodSyncWithTranscation21711626868385';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "methodId" int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_94c75cd58131399b47d119069a4" FOREIGN KEY ("methodId") REFERENCES "transaction_method"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_94c75cd58131399b47d119069a4"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "methodId"`);
  }
}
