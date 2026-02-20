import { MigrationInterface, QueryRunner } from 'typeorm';

export class ListColumnSortAdded1715376250966 implements MigrationInterface {
  name = 'ListColumnSortAdded1715376250966';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "list_columns_sort" ("id" int NOT NULL IDENTITY(1,1), "sortOrder" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_5d9703b2001e9cac6f546ee6986" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_79afc72222d9d5469c5972d7c22" DEFAULT getdate(), "deletedAt" datetime2, "listViewFilterId" int, "listColumnMetaId" int, CONSTRAINT "PK_9b450f514ef88bbffacecd048c1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_columns_sort" ADD CONSTRAINT "FK_4664050cceafa7ab9f0bef87502" FOREIGN KEY ("listViewFilterId") REFERENCES "list_views_filter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_columns_sort" ADD CONSTRAINT "FK_63357f9a68ea8f7f68ab6e3d078" FOREIGN KEY ("listColumnMetaId") REFERENCES "list_columns_meta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "list_columns_sort" DROP CONSTRAINT "FK_63357f9a68ea8f7f68ab6e3d078"`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_columns_sort" DROP CONSTRAINT "FK_4664050cceafa7ab9f0bef87502"`,
    );
    await queryRunner.query(`DROP TABLE "list_columns_sort"`);
  }
}
