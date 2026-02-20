import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationTableUpdate1722422899390
  implements MigrationInterface
{
  name = 'NotificationTableUpdate1722422899390';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "priority" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "priority"`,
    );
  }
}
