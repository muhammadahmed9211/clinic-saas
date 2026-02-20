import { MigrationInterface, QueryRunner } from 'typeorm';

export class Ledger1708100195255 implements MigrationInterface {
  name = 'Ledger1708100195255';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ledger" ("id" int NOT NULL IDENTITY(1,1), "type" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_5cd94fff677acfd7f4cd97cacf2" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_ec8a701c1fd43a01dbafcebe609" DEFAULT getdate(), "walletId" int, "userId" int, "transactionId" uniqueidentifier, CONSTRAINT "PK_7a322e9157e5f42a16750ba2a20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "ledger" ADD CONSTRAINT "FK_e5bc6d7a5e9945ba8f737c981c4" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ledger" ADD CONSTRAINT "FK_a21c3af32b2379186183e0c71b9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ledger" ADD CONSTRAINT "FK_ec148a48671d1b18321804bc5b6" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ledger" DROP CONSTRAINT "FK_ec148a48671d1b18321804bc5b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ledger" DROP CONSTRAINT "FK_a21c3af32b2379186183e0c71b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ledger" DROP CONSTRAINT "FK_e5bc6d7a5e9945ba8f737c981c4"`,
    );
    await queryRunner.query(`DROP TABLE "ledger"`);
  }
}
