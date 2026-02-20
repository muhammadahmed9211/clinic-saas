import { MigrationInterface, QueryRunner } from 'typeorm';

export class LeadTableModify1738766957080 implements MigrationInterface {
  name = 'LeadTableModify1738766957080';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "salesStatusUpdatedAt" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "retentionStatusUpdatedAt" datetime`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead" DROP COLUMN "retentionStatusUpdatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" DROP COLUMN "salesStatusUpdatedAt"`,
    );
  }
}
