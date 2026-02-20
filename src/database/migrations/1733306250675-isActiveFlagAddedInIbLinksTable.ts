import { MigrationInterface, QueryRunner } from 'typeorm';

export class IsActiveFlagAddedInIbLinksTable1733306250675
  implements MigrationInterface
{
  name = 'IsActiveFlagAddedInIbLinksTable1733306250675';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ib_links" ADD "isActive" bit NOT NULL CONSTRAINT "DF_b9c95ca60530ed934003121f6ae" DEFAULT 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ib_links" DROP CONSTRAINT "DF_b9c95ca60530ed934003121f6ae"`,
    );
    await queryRunner.query(`ALTER TABLE "ib_links" DROP COLUMN "isActive"`);
  }
}
