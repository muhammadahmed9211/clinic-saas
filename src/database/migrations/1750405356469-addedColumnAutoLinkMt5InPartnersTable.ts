import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedColumnAutoLinkMt5InPartnersTable1750405356469
  implements MigrationInterface
{
  name = 'AddedColumnAutoLinkMt5InPartnersTable1750405356469';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "autoLinkMt5" bit NOT NULL CONSTRAINT "DF_db612f60d89041145c86d5f748a" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_db612f60d89041145c86d5f748a"`,
    );
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "autoLinkMt5"`);
  }
}
