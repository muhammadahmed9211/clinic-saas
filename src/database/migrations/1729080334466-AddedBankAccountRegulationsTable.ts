import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedBankAccountRegulationsTable1729080334466
  implements MigrationInterface
{
  name = 'AddedBankAccountRegulationsTable1729080334466';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bank_account_regulations" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime NOT NULL CONSTRAINT "DF_8bef189e99c8b019f90092c6680" DEFAULT getdate(), "deletedAt" datetime2, "updatedAt" datetime NOT NULL CONSTRAINT "DF_4060879942573fc5316a5ff251b" DEFAULT getdate(), "bankAccountId" int NOT NULL, "regulationId" int NOT NULL, CONSTRAINT "PK_549438b8e4d63ae6bcd53287b84" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_account_regulations" ADD CONSTRAINT "FK_2b4e646f1d810b23c159c232c8f" FOREIGN KEY ("bankAccountId") REFERENCES "bank_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_account_regulations" ADD CONSTRAINT "FK_a89078af3fa7566ce4d59d574d3" FOREIGN KEY ("regulationId") REFERENCES "regulations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bank_account_regulations" DROP CONSTRAINT "FK_a89078af3fa7566ce4d59d574d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_account_regulations" DROP CONSTRAINT "FK_2b4e646f1d810b23c159c232c8f"`,
    );

    await queryRunner.query(`DROP TABLE "bank_account_regulations"`);
  }
}