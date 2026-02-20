import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedExchangeTableAndJoinWithTranscation1716800200993
  implements MigrationInterface
{
  name = 'AddedExchangeTableAndJoinWithTranscation1716800200993';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "exchange" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "contactName" nvarchar(255) NOT NULL, "address" nvarchar(255) NOT NULL, "city" nvarchar(255) NOT NULL, "country" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_07e37aa406b4f3b7fd4e7b36d76" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_8e7173671f5a9ab8e03190d0f59" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_cbd4568fcb476b57cebd8239895" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "exchangeDetailsId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_93dfa6d968d87d2c37470b2fd03" FOREIGN KEY ("exchangeDetailsId") REFERENCES "exchange"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_93dfa6d968d87d2c37470b2fd03"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "exchangeDetailsId"`,
    );
    await queryRunner.query(`DROP TABLE "exchange"`);
  }
}
