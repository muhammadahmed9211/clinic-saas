import { MigrationInterface, QueryRunner } from 'typeorm';

export class ListViewFilterAdded1715252067062 implements MigrationInterface {
  name = 'ListViewFilterAdded1715252067062';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "list_views_filter" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "isDefault" bit NOT NULL, "isPublic" bit NOT NULL, "isUserDefault" bit NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_f872c2a4ff41bdaa81fc63cd4bd" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_b86f05f0d9f626c37ac1c97a8b3" DEFAULT getdate(), "deletedAt" datetime2, "userId" int, "listId" int, CONSTRAINT "PK_864229b4d83fc84fd253fdef9fc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_views_filter" ADD CONSTRAINT "FK_450977fcfbe3dd2b0463d64ce81" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_views_filter" ADD CONSTRAINT "FK_c7358185f370af1ef2f2ff79461" FOREIGN KEY ("listId") REFERENCES "list_name"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "list_views_filter" DROP CONSTRAINT "FK_c7358185f370af1ef2f2ff79461"`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_views_filter" DROP CONSTRAINT "FK_450977fcfbe3dd2b0463d64ce81"`,
    );

    await queryRunner.query(`DROP TABLE "list_views_filter"`);
  }
}
