import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedIsTransferTorentionInTransactionTable1742454552763
  implements MigrationInterface
{
  name = 'AddedIsTransferTorentionInTransactionTable1742454552763';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "isTransferToRetention" bit NOT NULL CONSTRAINT "DF_fa0b0d14fd44fe95f7e5898d2e5" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "DF_fa0b0d14fd44fe95f7e5898d2e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "isTransferToRetention"`,
    );
  }
}
