import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRolePermission1716278994544 implements MigrationInterface {
  name = 'UpdateRolePermission1716278994544';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permission_category" DROP COLUMN "namne"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission_category" DROP COLUMN "parentCategoryId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission_category" ADD "name" nvarchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permission_category" DROP COLUMN "name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission_category" ADD "parentCategoryId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission_category" ADD "namne" nvarchar(255) NOT NULL`,
    );
  }
}
