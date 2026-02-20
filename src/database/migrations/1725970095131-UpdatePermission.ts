import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePermission1725970095131 implements MigrationInterface {
  name = 'UpdatePermission1725970095131';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permission" ADD "meta" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission_role_rel" ADD "meta" nvarchar(MAX)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permission_role_rel" DROP COLUMN "meta"`,
    );
    await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "meta"`);
  }
}
