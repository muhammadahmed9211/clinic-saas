import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePartner1719434595181 implements MigrationInterface {
  name = 'UpdatePartner1719434595181';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner" ALTER COLUMN "telephone" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner" ALTER COLUMN "telephone" nvarchar(255) NOT NULL`,
    );
  }
}
