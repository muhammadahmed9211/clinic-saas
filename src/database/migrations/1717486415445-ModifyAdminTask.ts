import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyAdminTask1717486415445 implements MigrationInterface {
  name = 'ModifyAdminTask1717486415445';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "FK_be3c9f1acbe21e0070039b5cf79"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "FK_2564f95332f9027d30e89bc6cb0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "FK_40e22c93433b631db2b2bfd7e71"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP COLUMN "createdById"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD "createdById" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "FK_2564f95332f9027d30e89bc6cb0" FOREIGN KEY ("labelId") REFERENCES "label"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "FK_be3c9f1acbe21e0070039b5cf79" FOREIGN KEY ("taskId") REFERENCES "master_task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "FK_40e22c93433b631db2b2bfd7e71" FOREIGN KEY ("createdById") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "FK_40e22c93433b631db2b2bfd7e71"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "FK_be3c9f1acbe21e0070039b5cf79"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "FK_2564f95332f9027d30e89bc6cb0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP COLUMN "createdById"`,
    );
    await queryRunner.query(`ALTER TABLE "admin_task" ADD "createdById" int`);
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "FK_40e22c93433b631db2b2bfd7e71" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "FK_2564f95332f9027d30e89bc6cb0" FOREIGN KEY ("labelId") REFERENCES "label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "FK_be3c9f1acbe21e0070039b5cf79" FOREIGN KEY ("taskId") REFERENCES "master_task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
