import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAdminTask1717674726151 implements MigrationInterface {
  name = 'UpdateAdminTask1717674726151';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "FK_40e22c93433b631db2b2bfd7e71"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "FK_06ed203057ce574fec5a08c8601"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP COLUMN "assignToId"`,
    );
    await queryRunner.query(`ALTER TABLE "admin_task" ADD "assignToId" int`);
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP COLUMN "createdById"`,
    );
    await queryRunner.query(`ALTER TABLE "admin_task" ADD "createdById" int`);
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "FK_06ed203057ce574fec5a08c8601" FOREIGN KEY ("assignToId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "FK_40e22c93433b631db2b2bfd7e71" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "FK_40e22c93433b631db2b2bfd7e71"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "FK_06ed203057ce574fec5a08c8601"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP COLUMN "createdById"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD "createdById" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP COLUMN "assignToId"`,
    );
    await queryRunner.query(`ALTER TABLE "admin_task" ADD "assignToId" bigint`);
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "FK_06ed203057ce574fec5a08c8601" FOREIGN KEY ("assignToId") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "FK_40e22c93433b631db2b2bfd7e71" FOREIGN KEY ("createdById") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
