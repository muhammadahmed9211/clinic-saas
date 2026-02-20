import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOperatorWeeklyCount1721129609535
  implements MigrationInterface
{
  name = 'UpdateOperatorWeeklyCount1721129609535';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "operator" ADD "weeklyCount" int`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "weeklyCount"`);
  }
}
