import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeNameToAssignTo1716410016932 implements MigrationInterface {
  name = 'ChangeNameToAssignTo1716410016932';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "FK_06ed203057ce574fec5a08c8601"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "FK_06ed203057ce574fec5a08c8601" FOREIGN KEY ("assignToId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "FK_06ed203057ce574fec5a08c8601"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "FK_06ed203057ce574fec5a08c8601" FOREIGN KEY ("assignToId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
