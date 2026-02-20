import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionandWallet1708083828061 implements MigrationInterface {
  name = 'TransactionandWallet1708083828061';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "hash" varchar(50) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "amount"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "amount" float NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "wallet" ("id" int NOT NULL IDENTITY(1,1), "currency" varchar(10) NOT NULL, "balance" float NOT NULL, "actualBalance" float NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_e6c3ae92472e3db968801badbec" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_fe7171da825dda8cfc9fdc2ebdd" DEFAULT getdate(), "userId" int, CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "amount"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "amount" int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "hash"`);
    await queryRunner.query(`DROP TABLE "wallet"`);
  }
}
