import { MigrationInterface, QueryRunner } from 'typeorm';

export class IsActiveAddedInUserTable1722958716016
  implements MigrationInterface
{
  name = 'IsActiveAddedInUserTable1722958716016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "isActive" bit`);
    await queryRunner.query(
      `CREATE INDEX "IDX_fde2ce12ab12b02ae583dd76c7" ON "user" ("isActive") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_fde2ce12ab12b02ae583dd76c7" ON "user"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isActive"`);
  }
}
