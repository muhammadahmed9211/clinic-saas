import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlteredTransactionTable1722848679650
  implements MigrationInterface
{
  name = 'AlteredTransactionTable1722848679650';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" ADD "paidAmount" float`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "netAmount" float`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "netAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "paidAmount"`,
    );
  }
}
