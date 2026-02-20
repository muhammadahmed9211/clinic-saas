import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterDesk1716302822706 implements MigrationInterface {
  name = 'AlterDesk1716302822706';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "desk" ADD "deletedAt" datetime2`);
    await queryRunner.query(
      `ALTER TABLE "desk" ADD "system" bigint NOT NULL CONSTRAINT "DF_8caeb3cff4380c6fb5691ceb351" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "desk" DROP CONSTRAINT "DF_8caeb3cff4380c6fb5691ceb351"`,
    );
    await queryRunner.query(`ALTER TABLE "desk" DROP COLUMN "system"`);
    await queryRunner.query(`ALTER TABLE "desk" DROP COLUMN "deletedAt"`);
  }
}
