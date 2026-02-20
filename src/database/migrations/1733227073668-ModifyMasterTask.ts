import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyMasterTask1733227073668 implements MigrationInterface {
  name = 'ModifyMasterTask1733227073668';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_task" ADD "deletedAt" datetime2`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_task" ADD "createdById" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_task" ADD CONSTRAINT "FK_e0a47e3e332ffdf1859105702b4" FOREIGN KEY ("createdById") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_task" DROP CONSTRAINT "FK_e0a47e3e332ffdf1859105702b4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_task" DROP COLUMN "createdById"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_task" DROP COLUMN "deletedAt"`,
    );
  }
}
