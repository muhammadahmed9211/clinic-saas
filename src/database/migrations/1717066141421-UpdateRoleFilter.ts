import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRoleFilter1717066141421 implements MigrationInterface {
  name = 'UpdateRoleFilter1717066141421';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_filter_rel" DROP CONSTRAINT "FK_338f5e500089957bdf009396178"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_filter_rel" DROP CONSTRAINT "FK_2d91869afb2eaa75d9b5eecebff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_filter_rel" ADD CONSTRAINT "FK_338f5e500089957bdf009396178" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_filter_rel" ADD CONSTRAINT "FK_2d91869afb2eaa75d9b5eecebff" FOREIGN KEY ("roleFilterId") REFERENCES "role_filter"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_filter_rel" DROP CONSTRAINT "FK_2d91869afb2eaa75d9b5eecebff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_filter_rel" DROP CONSTRAINT "FK_338f5e500089957bdf009396178"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_filter_rel" ADD CONSTRAINT "FK_2d91869afb2eaa75d9b5eecebff" FOREIGN KEY ("roleFilterId") REFERENCES "role_filter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_filter_rel" ADD CONSTRAINT "FK_338f5e500089957bdf009396178" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
