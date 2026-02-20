import { MigrationInterface, QueryRunner } from 'typeorm';

export class Notifications1718500946572 implements MigrationInterface {
  name = 'Notifications1718500946572';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `EXEC sp_rename "notifications.description_lable_id", "description_label_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_5ef11167cd111e6f28aa3d86b91" FOREIGN KEY ("description_label_id") REFERENCES "label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_5ef11167cd111e6f28aa3d86b91"`,
    );
    await queryRunner.query(
      `EXEC sp_rename "notifications.description_label_id", "description_lable_id"`,
    );
  }
}
