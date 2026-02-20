import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationUpdate1719232907773 implements MigrationInterface {
  name = 'NotificationUpdate1719232907773';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "entity_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "entity_id" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "entity_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "entity_id" int NOT NULL`,
    );
  }
}
