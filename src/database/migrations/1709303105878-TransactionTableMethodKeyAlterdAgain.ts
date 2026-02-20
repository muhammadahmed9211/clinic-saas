import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionTableMethodKeyAlterdAgain1709303105878
  implements MigrationInterface
{
  name = 'TransactionTableMethodKeyAlterdAgain1709303105878';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "method" nvarchar(255) CONSTRAINT CHK_7f79e4b8a1f6f8a213dd93d0c2_ENUM CHECK(method IN ('CREDIT_CARD','WIRE','MIGRATION','INTERNAL_TRANSFER','EXTERNAL_EXCHANGE','NONE')) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "method"`);
  }
}
