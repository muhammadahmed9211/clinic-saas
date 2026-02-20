import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserTask1731241343954 implements MigrationInterface {
  name = 'UpdateUserTask1731241343954';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`ALTER TABLE "operator_targets" DROP COLUMN "type"`);
    await queryRunner.query(`ALTER TABLE "master_task" ADD "regulationId" int`);
    await queryRunner.query(
      `ALTER TABLE "master_task" ADD CONSTRAINT "FK_9c39f645fadc1f87d5078f1ce39" FOREIGN KEY ("regulationId") REFERENCES "regulations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_task" DROP CONSTRAINT "FK_9c39f645fadc1f87d5078f1ce39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_task" DROP COLUMN "regulationId"`,
    );
  }
}
