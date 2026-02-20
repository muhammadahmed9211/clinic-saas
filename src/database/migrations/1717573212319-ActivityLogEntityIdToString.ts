import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActivityLogEntityIdToString1717573212319
  implements MigrationInterface
{
  name = 'ActivityLogEntityIdToString1717573212319';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_log" DROP COLUMN "entity_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_log" ADD "entity_id" nvarchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_log" DROP COLUMN "entity_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_log" ADD "entity_id" int NOT NULL`,
    );
  }
}
