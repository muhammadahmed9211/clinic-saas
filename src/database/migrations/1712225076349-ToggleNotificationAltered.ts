import { MigrationInterface, QueryRunner } from 'typeorm';

export class ToggleNotificationAltered1712225076349
  implements MigrationInterface
{
  name = 'ToggleNotificationAltered1712225076349';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "notification" bit`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "notification"`);
  }
}
