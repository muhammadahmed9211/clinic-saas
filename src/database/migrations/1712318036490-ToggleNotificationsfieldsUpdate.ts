import { MigrationInterface, QueryRunner } from 'typeorm';

export class ToggleNotificationsfieldsUpdate1712318036490
  implements MigrationInterface
{
  name = 'ToggleNotificationsfieldsUpdate1712318036490';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "notification"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isEmailNotificationsEnabled" bit`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isWhatsappNotificationsEnabled" bit`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isSmsNotificationsEnabled" bit`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isSmsNotificationsEnabled"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isWhatsappNotificationsEnabled"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isEmailNotificationsEnabled"`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "notification" bit`);
  }
}
