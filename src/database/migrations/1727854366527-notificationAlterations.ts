import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationAlterations1727854366527
  implements MigrationInterface
{
  name = 'NotificationAlterations1727854366527';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "link" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "link"`);
  }
}
