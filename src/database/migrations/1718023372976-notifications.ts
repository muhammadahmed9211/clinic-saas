import { MigrationInterface, QueryRunner } from 'typeorm';

export class Notifications1718023372976 implements MigrationInterface {
  name = 'Notifications1718023372976';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "title" nvarchar(255) NOT NULL CONSTRAINT "DF_762a36a52d3233955639e53decd" DEFAULT 'Notification'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "DF_762a36a52d3233955639e53decd"`,
    );
    await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "title"`);
  }
}
