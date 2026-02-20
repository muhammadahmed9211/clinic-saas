import { MigrationInterface, QueryRunner } from 'typeorm';

export class Notifications1715168436772 implements MigrationInterface {
  name = 'Notifications1715168436772';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" int NOT NULL IDENTITY(1,1), "entity_id" int NOT NULL, "entity_name" nvarchar(255) NOT NULL, "title_label_id" int NOT NULL, "description_lable_id" int, "created_by" nvarchar(255) NOT NULL, "is_read" bit NOT NULL, "is_deleted" bit NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_77ee7b06d6f802000c0846f3a56" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_bc1d74459bf51659c6f4e4c429a" DEFAULT getdate(), "deleted_at" datetime2, "user_id" int, "creator_id" int, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_3179be2e8b1771a4f0fb9e7102a" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_3179be2e8b1771a4f0fb9e7102a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`,
    );
    await queryRunner.query(`DROP TABLE "notifications"`);
  }
}
