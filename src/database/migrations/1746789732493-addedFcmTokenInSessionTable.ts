import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedFcmTokenInSessionTable1746789732493
  implements MigrationInterface
{
  name = 'AddedFcmTokenInSessionTable1746789732493';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" ADD "fcmToken" nvarchar(100)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "fcmToken"`);
  }
}
