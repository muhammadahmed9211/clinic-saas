import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateActivityLogs1715084094628 implements MigrationInterface {
  name = 'UpdateActivityLogs1715084094628';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "activity_log_type" ("id" int NOT NULL IDENTITY(1,1), "type" nvarchar(255) NOT NULL, "key" int NOT NULL, "value" nvarchar(255) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_97883f557daf913a8ec6eb458e2" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_832395fbf4599e2a30b604b95eb" DEFAULT getdate(), CONSTRAINT "PK_b7bd9b65a680c6290be0498801e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "activity_log" ("id" int NOT NULL IDENTITY(1,1), "action" int, "entity_id" bigint, "entity_type" int, "json_object" nvarchar(MAX), "performer_id" bigint NOT NULL, "performer_type" int NOT NULL, "parent_id" bigint, "parent_type" int, "archive_insertion_date" datetime, "is_from_archive" tinyint NOT NULL, "trigger_type" int NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_4df1cd3ed889a9d5cdd69e53474" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_59a11dbe6c526f2507209d9337c" DEFAULT getdate(), CONSTRAINT "PK_067d761e2956b77b14e534fd6f1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1715084101522 FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1715084101625 FOR "dateTime"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1713965359884. FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1713965360594. FOR "dateTime"`,
    );
    await queryRunner.query(`DROP TABLE "activity_log"`);
    await queryRunner.query(`DROP TABLE "activity_log_type"`);
  }
}
