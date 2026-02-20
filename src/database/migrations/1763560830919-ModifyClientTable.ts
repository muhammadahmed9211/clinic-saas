import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyClientTable1763560830919 implements MigrationInterface {
  name = 'ModifyClientTable1763560830919';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ALTER COLUMN "telephone" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ALTER COLUMN "telephonePrefix" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ALTER COLUMN "telephonePrefix" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ALTER COLUMN "telephone" nvarchar(255) NOT NULL`,
    );
  }
}
