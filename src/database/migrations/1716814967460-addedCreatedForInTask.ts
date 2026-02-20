import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedCreatedForInTask1716814967460 implements MigrationInterface {
  name = 'AddedCreatedForInTask1716814967460';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "admin_task" ADD "createdForId" int`);
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "FK_86c29887c6c29f6287f476fbd10" FOREIGN KEY ("createdForId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "FK_86c29887c6c29f6287f476fbd10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP COLUMN "createdForId"`,
    );
  }
}
