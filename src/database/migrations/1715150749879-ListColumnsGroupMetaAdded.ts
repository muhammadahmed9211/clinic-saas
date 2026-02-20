import { MigrationInterface, QueryRunner } from 'typeorm';

export class ListColumnsGroupMetaAdded1715150749879
  implements MigrationInterface
{
  name = 'ListColumnsGroupMetaAdded1715150749879';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "list_columns_meta" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "label" nvarchar(255) NOT NULL, "isFilterAble" bit NOT NULL CONSTRAINT "DF_4f60365366a5760464acd2208e3" DEFAULT 0, "isSortable" bit NOT NULL CONSTRAINT "DF_c4bbd1934548e5d691255793635" DEFAULT 0, "createdAt" datetime NOT NULL CONSTRAINT "DF_3ae8eec90eefc3f6dbcd8ce88ac" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_7ab14811f32095b1918fd79b07a" DEFAULT getdate(), "deletedAt" datetime2, "listId" int, "groupId" int, CONSTRAINT "PK_de2677619fab9ecf865e8dd6362" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_columns_meta" ADD CONSTRAINT "FK_211d34eb69685efbb52b581f388" FOREIGN KEY ("listId") REFERENCES "list_name"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_columns_meta" ADD CONSTRAINT "FK_830065f5da660c45611fb1b8985" FOREIGN KEY ("groupId") REFERENCES "list_columns_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "list_columns_meta" DROP CONSTRAINT "FK_830065f5da660c45611fb1b8985"`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_columns_meta" DROP CONSTRAINT "FK_211d34eb69685efbb52b581f388"`,
    );
    await queryRunner.query(`DROP TABLE "list_columns_meta"`);
  }
}
