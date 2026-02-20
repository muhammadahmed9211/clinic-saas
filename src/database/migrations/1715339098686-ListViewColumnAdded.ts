import { MigrationInterface, QueryRunner } from 'typeorm';

export class ListViewColumnAdded1715339098686 implements MigrationInterface {
  name = 'ListViewColumnAdded1715339098686';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "list_view_column" ("id" int NOT NULL IDENTITY(1,1), "sequence" int NOT NULL, "isSticky" bit NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_3e32ce1d95bfcc562406b763083" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_00bcc7c8e5ac39b0fa613372254" DEFAULT getdate(), "deletedAt" datetime2, "listColumnsMetaId" int, "listViewFilterId" int, CONSTRAINT "PK_40be673a713e8a310efbdfcef60" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_view_column" ADD CONSTRAINT "FK_2ea42332c68a28c1d8bbe632c32" FOREIGN KEY ("listColumnsMetaId") REFERENCES "list_columns_meta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_view_column" ADD CONSTRAINT "FK_c7c1f076c5395861696e1629124" FOREIGN KEY ("listViewFilterId") REFERENCES "list_views_filter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "list_view_column" DROP CONSTRAINT "FK_c7c1f076c5395861696e1629124"`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_view_column" DROP CONSTRAINT "FK_2ea42332c68a28c1d8bbe632c32"`,
    );
    await queryRunner.query(`DROP TABLE "list_view_column"`);
  }
}
