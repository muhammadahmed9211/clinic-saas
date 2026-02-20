import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePermission1719399123456 implements MigrationInterface {
  name = 'UpdatePermission1719399123456';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permission" ADD "isActive" bit NOT NULL CONSTRAINT "DF_3962ca290a21cbb5cc6fe6129c7" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permission" DROP CONSTRAINT "DF_3962ca290a21cbb5cc6fe6129c7"`,
    );
    await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "isActive"`);
  }
}
