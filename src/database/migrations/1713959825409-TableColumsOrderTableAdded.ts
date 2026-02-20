import { MigrationInterface, QueryRunner } from 'typeorm';

export class TableColumsOrderTableAdded1713959825409
  implements MigrationInterface
{
  name = 'TableColumsOrderTableAdded1713959825409';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "table_column_order" ("id" int NOT NULL IDENTITY(1,1), "order" int NOT NULL, "columnName" nvarchar(255) NOT NULL, "tableName" nvarchar(255) NOT NULL, "isSticky" bit NOT NULL CONSTRAINT "DF_5ac59ecb66c7b02e6bce3f65856" DEFAULT 0, "createdAt" datetime NOT NULL CONSTRAINT "DF_25b3d1287683b2c1af3dae2ffa1" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_87f96c3983d5b543d68764975d1" DEFAULT getdate(), "deletedAt" datetime2, "userId" int NOT NULL, CONSTRAINT "PK_24b2d6e7bd66d65db2ce7dede6d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "table_column_order" ADD CONSTRAINT "FK_be7f5f894d0bff1624ff66cb1a5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "table_column_order" DROP CONSTRAINT "FK_be7f5f894d0bff1624ff66cb1a5"`,
    );
    await queryRunner.query(`DROP TABLE "table_column_order"`);
  }
}
