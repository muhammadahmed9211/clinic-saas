import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActiveLogsCreate1713183271319 implements MigrationInterface {
  name = 'ActiveLogsCreate1713183271319';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "active_log" ("id" int NOT NULL IDENTITY(1,1), "action" int, "entity_id" bigint, "entity_type" int, "json_object" nvarchar(MAX), "performer_id" bigint NOT NULL, "performer_type" int NOT NULL, "parent_id" bigint, "parent_type" int, "archive_insertion_date" datetime, "is_from_archive" tinyint NOT NULL, "trigger_type" int NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_5286479474a57a23449051d7d57" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_b321bfb653d42380159824eec43" DEFAULT getdate(), CONSTRAINT "PK_75a2987ba2b19dfe38184130bff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1713183277838 FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1713183277942 FOR "dateTime"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1713177938436. FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1713177938341. FOR "dateTime"`,
    );
    await queryRunner.query(`DROP TABLE "active_log"`);
  }
}
