import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyAutomationConfigTable1750425753119
  implements MigrationInterface
{
  name = 'ModifyAutomationConfigTable1750425753119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "automation_config" ADD "deletedAt" datetime2`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "automation_config" DROP COLUMN "deletedAt"`,
    );
  }
}
