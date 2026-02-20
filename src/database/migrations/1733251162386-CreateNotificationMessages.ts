import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotificationMessages1733251162386
  implements MigrationInterface
{
  name = 'CreateNotificationMessages1733251162386';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notification_messages" ("id" int NOT NULL IDENTITY(1,1), "title" nvarchar(255) NOT NULL CONSTRAINT "DF_3a61deec0d4e247cf82a3877ed8" DEFAULT 'Notification', "description" nvarchar(255), "created_at" datetime2 NOT NULL CONSTRAINT "DF_862affc8a5edf24d3f6f9ef9323" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_379c343c41d3473d610897e3382" DEFAULT getdate(), "deleted_at" datetime2, "title_label_id" int, "description_label_id" int, CONSTRAINT "PK_025a03ac35a495f0a6d8730350d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_messages" ADD CONSTRAINT "FK_cde37aeff333e9129b683175f1f" FOREIGN KEY ("title_label_id") REFERENCES "label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_messages" ADD CONSTRAINT "FK_bd5d680175ab9b6a5cefe6a95bc" FOREIGN KEY ("description_label_id") REFERENCES "label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_messages" DROP CONSTRAINT "FK_bd5d680175ab9b6a5cefe6a95bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_messages" DROP CONSTRAINT "FK_cde37aeff333e9129b683175f1f"`,
    );
    await queryRunner.query(`DROP TABLE "notification_messages"`);
  }
}
