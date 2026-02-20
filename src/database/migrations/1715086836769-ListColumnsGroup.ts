import { MigrationInterface, QueryRunner } from 'typeorm';

export class ListColumnsGroup1715086836769 implements MigrationInterface {
  name = 'ListColumnsGroup1715086836769';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "list_columns_group" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_013c3d9111b0363c2503cc13284" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_04c4efce1581b762263f22dc1e2" DEFAULT getdate(), "deletedAt" datetime2, "listId" int, CONSTRAINT "PK_f70b0c3ab56c8f479032b319d66" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_columns_group" ADD CONSTRAINT "FK_dc542a368602d2ff048062058f0" FOREIGN KEY ("listId") REFERENCES "list_name"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "list_columns_group" DROP CONSTRAINT "FK_dc542a368602d2ff048062058f0"`,
    );
    await queryRunner.query(`DROP TABLE "list_columns_group"`);
  }
}
