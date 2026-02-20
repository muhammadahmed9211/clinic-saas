import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExportedTransectionEntity1720730241803
  implements MigrationInterface
{
  name = 'ExportedTransectionEntity1720730241803';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "exported_transactions" ("id" int NOT NULL IDENTITY(1,1), "operatorId" int, "operatorEmail" nvarchar(255), "url" nvarchar(255), "createdAt" datetime NOT NULL CONSTRAINT "DF_fd4e00f0be56c6063e928011d27" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_cc6e7a86ac3f09b97a3efa4b526" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_56334bf76bb60aa755454d984dd" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "exported_transactions"`);
  }
}
