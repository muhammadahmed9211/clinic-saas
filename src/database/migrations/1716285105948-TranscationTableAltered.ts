import { MigrationInterface, QueryRunner } from 'typeorm';

export class TranscationTableAltered1716285105948
  implements MigrationInterface
{
  name = 'TranscationTableAltered1716285105948';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "internalNote" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "transactionNote" varchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "transactionNote"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "internalNote"`,
    );
  }
}
