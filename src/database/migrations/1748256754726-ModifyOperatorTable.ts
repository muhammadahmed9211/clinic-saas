import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyOperatorTable1748256754726 implements MigrationInterface {
  name = 'ModifyOperatorTable1748256754726';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator" ADD "leadReassignWeeklyCount" int NOT NULL CONSTRAINT "DF_d2ea986050388314a8f07c11ca8" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator" DROP COLUMN "leadReassignWeeklyCount"`,
    );
  }
}
