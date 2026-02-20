import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterNotifications1715270655317 implements MigrationInterface {
  name = 'AlterNotifications1715270655317';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "DF_f12148ce379462ebbb4d06cc136" DEFAULT 0 FOR "is_read"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "DF_a30728a05595f202f94262989a9" DEFAULT 0 FOR "is_deleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "title_label_id" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_cb54c90fa3973d38e03b6629ccd" FOREIGN KEY ("title_label_id") REFERENCES "label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_cb54c90fa3973d38e03b6629ccd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "title_label_id" int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "DF_a30728a05595f202f94262989a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "DF_f12148ce379462ebbb4d06cc136"`,
    );
  }
}
