import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyNotification1734250833289 implements MigrationInterface {
  name = 'ModifyNotification1734250833289';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "is_emit" bit NOT NULL CONSTRAINT "DF_6beff568653f36266c5a29b8993" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "DF_6beff568653f36266c5a29b8993"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "is_emit"`,
    );
  }
}
