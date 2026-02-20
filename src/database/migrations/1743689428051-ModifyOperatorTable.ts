import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyOperatorTable1743689428051 implements MigrationInterface {
  name = 'ModifyOperatorTable1743689428051';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator" ADD "retentionWeeklyCount" int NOT NULL CONSTRAINT "DF_7ca0341fab147b49808f3189ce1" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator" DROP COLUMN "retentionWeeklyCount"`,
    );
  }
}
