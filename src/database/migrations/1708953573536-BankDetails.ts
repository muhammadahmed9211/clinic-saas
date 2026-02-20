import { MigrationInterface, QueryRunner } from 'typeorm';

export class BankDetails1708953573536 implements MigrationInterface {
  name = 'BankDetails1708953573536';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bank_detail" ("id" int NOT NULL IDENTITY(1,1), "iban" varchar(255) NOT NULL, "currency" varchar(255) NOT NULL, "swift" varchar(255) NOT NULL, "sortCode" varchar(255), "address" varchar(255) NOT NULL, "state" varchar(255) NOT NULL, "zipCode" varchar(255) NOT NULL, "country" varchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_455d8d00bdc5097259090b0da6a" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_1ea286285661e4e9669931e9284" DEFAULT getdate(), "deletedAt" datetime2, "statementId" uniqueidentifier, "userId" int, CONSTRAINT "PK_bfdac1bd6b02588c81b816a4a2c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_detail" ADD CONSTRAINT "FK_1b3ab35daa003ff2a97ac1d056d" FOREIGN KEY ("statementId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_detail" ADD CONSTRAINT "FK_91191a915dd6efb2848afd95eca" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bank_detail" DROP CONSTRAINT "FK_91191a915dd6efb2848afd95eca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_detail" DROP CONSTRAINT "FK_1b3ab35daa003ff2a97ac1d056d"`,
    );
    await queryRunner.query(`DROP TABLE "bank_detail"`);
  }
}
