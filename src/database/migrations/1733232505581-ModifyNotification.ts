import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyNotification1733232505581 implements MigrationInterface {
  name = 'ModifyNotification1733232505581';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "description" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "description"`,
    );
  }
}
