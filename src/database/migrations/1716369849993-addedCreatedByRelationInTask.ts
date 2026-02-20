import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedCreatedByRelationInTask1716369849993
  implements MigrationInterface
{
  name = 'AddedCreatedByRelationInTask1716369849993';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `EXEC sp_rename "admin_task.createdBy", "createdById"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ALTER COLUMN "createdById" int`,
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
      `ALTER TABLE "admin_task" ALTER COLUMN "createdById" int NOT NULL`,
    );
    await queryRunner.query(
      `EXEC sp_rename "admin_task.createdById", "createdBy"`,
    );
  }
}
