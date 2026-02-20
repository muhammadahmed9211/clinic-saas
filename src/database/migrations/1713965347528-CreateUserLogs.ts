import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserLogs1713965347528 implements MigrationInterface {
  name = 'CreateUserLogs1713965347528';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_log" ("id" int NOT NULL IDENTITY(1,1), "leftValue" nvarchar(255) NOT NULL, "rightValue" nvarchar(255) NOT NULL, "field" nvarchar(255) NOT NULL, "entity_id" int NOT NULL, "entity_type" int NOT NULL, "performer_id" int NOT NULL, "performer_type" int NOT NULL, "trigger_type" nvarchar(255) NOT NULL, "action" nvarchar(255) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_69abb393407bf38c1273ef8280d" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_3a0ae1051d9bee717b1459f2530" DEFAULT getdate(), CONSTRAINT "PK_eca046d4b8c20d9309b35f07b69" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1713965359884 FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1713965360594 FOR "dateTime"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1713958439030. FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1713958439237. FOR "dateTime"`,
    );
    await queryRunner.query(`DROP TABLE "user_log"`);
  }
}
