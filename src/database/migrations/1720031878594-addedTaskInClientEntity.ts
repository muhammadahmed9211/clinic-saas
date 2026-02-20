import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTaskInClientEntity1720031878594
  implements MigrationInterface
{
  name = 'AddedTaskInClientEntity1720031878594';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" ADD "recentTaskId" int`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_c55d968bdb35c5b3f348d1b2ed" ON "client" ("recentTaskId") WHERE "recentTaskId" IS NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_c55d968bdb35c5b3f348d1b2edb" FOREIGN KEY ("recentTaskId") REFERENCES "admin_task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_c55d968bdb35c5b3f348d1b2edb"`,
    );
    await queryRunner.query(
      `DROP INDEX "REL_c55d968bdb35c5b3f348d1b2ed" ON "client"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "recentTaskId"`);
  }
}
