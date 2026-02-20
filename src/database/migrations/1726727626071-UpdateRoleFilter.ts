import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRoleFilter1726727626071 implements MigrationInterface {
  name = 'UpdateRoleFilter1726727626071';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_filter_rel" ADD "condition" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_filter_rel" DROP COLUMN "condition"`,
    );
  }
}
