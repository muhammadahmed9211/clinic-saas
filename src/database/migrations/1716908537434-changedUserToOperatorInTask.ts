import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangedUserToOperatorInTask1716908537434
  implements MigrationInterface
{
  name = 'ChangedUserToOperatorInTask1716908537434';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "FK_06ed203057ce574fec5a08c8601"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP COLUMN "assignToId"`,
    );
    await queryRunner.query(`ALTER TABLE "admin_task" ADD "assignToId" bigint`);
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "FK_06ed203057ce574fec5a08c8601" FOREIGN KEY ("assignToId") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "FK_06ed203057ce574fec5a08c8601"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP COLUMN "assignToId"`,
    );
    await queryRunner.query(`ALTER TABLE "admin_task" ADD "assignToId" int`);
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "FK_06ed203057ce574fec5a08c8601" FOREIGN KEY ("assignToId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
