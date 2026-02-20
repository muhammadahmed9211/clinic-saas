import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRoleFilter1716897231677 implements MigrationInterface {
  name = 'UpdateRoleFilter1716897231677';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_filter_rel" ADD "filterRefIds" text NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_filter_rel" DROP COLUMN "filterRefIds"`,
    );
  }
}
