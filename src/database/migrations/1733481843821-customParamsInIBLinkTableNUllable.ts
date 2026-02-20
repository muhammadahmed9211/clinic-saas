import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustomParamsInIBLinkTableNUllable1733481843821
  implements MigrationInterface
{
  name = 'CustomParamsInIBLinkTableNUllable1733481843821';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ib_links" ALTER COLUMN "p1" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "ib_links" ALTER COLUMN "p2" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "ib_links" ALTER COLUMN "p3" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ib_links" ALTER COLUMN "p3" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ib_links" ALTER COLUMN "p2" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ib_links" ALTER COLUMN "p1" nvarchar(255) NOT NULL`,
    );
  }
}
