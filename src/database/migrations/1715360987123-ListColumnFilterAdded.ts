import { MigrationInterface, QueryRunner } from 'typeorm';

export class ListColumnFilterAdded1715360987123 implements MigrationInterface {
  name = 'ListColumnFilterAdded1715360987123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "list_column_filter" ("id" int NOT NULL IDENTITY(1,1), "operator" nvarchar(255) NOT NULL, "values" text NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_4b8e672dd67d961a53d0feaf78e" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_984272693178a8923fc5902abf1" DEFAULT getdate(), "deletedAt" datetime2, "listViewFilterId" int, "listColumnMetaId" int, CONSTRAINT "PK_a78d3c2de8ec618de6391926f66" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_column_filter" ADD CONSTRAINT "FK_95da7837a7fe7d8207f04d82e24" FOREIGN KEY ("listViewFilterId") REFERENCES "list_views_filter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_column_filter" ADD CONSTRAINT "FK_dffe1eaeffbbab4b1a9120ae251" FOREIGN KEY ("listColumnMetaId") REFERENCES "list_columns_meta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "list_column_filter" DROP CONSTRAINT "FK_dffe1eaeffbbab4b1a9120ae251"`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_column_filter" DROP CONSTRAINT "FK_95da7837a7fe7d8207f04d82e24"`,
    );
    await queryRunner.query(`DROP TABLE "list_column_filter"`);
  }
}
