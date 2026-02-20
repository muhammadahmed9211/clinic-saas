import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionTableAltered1709120483804
  implements MigrationInterface
{
  name = 'TransactionTableAltered1709120483804';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `EXEC sp_rename "transaction.wallet", "walletId"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "walletId"`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "walletId" int`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "walletId"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "walletId" varchar(15)`,
    );
    await queryRunner.query(
      `EXEC sp_rename "transaction.walletId", "wallet"`,
    );
  }
}
