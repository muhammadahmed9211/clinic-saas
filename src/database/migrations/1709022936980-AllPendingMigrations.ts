import { MigrationInterface, QueryRunner } from 'typeorm';

export class AllPendingMigrations1709022936980 implements MigrationInterface {
  name = 'AllPendingMigrations1709022936980';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "question" ADD "step" int`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "step"`);
  }
}
