import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionTableAltered1709382840328
  implements MigrationInterface
{
  name = 'TransactionTableAltered1709382840328';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "externalTransactionId" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "commentForUser" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "internalComment" varchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "internalComment"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "commentForUser"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "externalTransactionId"`,
    );
  }
}
