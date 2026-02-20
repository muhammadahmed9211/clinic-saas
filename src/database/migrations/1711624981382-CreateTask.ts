import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTask1711624981382 implements MigrationInterface {
  name = 'CreateTask1711624981382';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "label_translation" ("id" int NOT NULL IDENTITY(1,1), "langCode" nvarchar(255) NOT NULL, "text" nvarchar(255) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_69c3f5902f33036cb7f9d34a3ae" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_d04f7403771cfb4b04ca051dcd7" DEFAULT getdate(), CONSTRAINT "PK_fb63525af8efe7aab7eef218aac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_task" ("id" int NOT NULL IDENTITY(1,1), "taskId" int NOT NULL, "dateTime" datetime CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1711624986898, "dueDateTime" datetime, "isForced" bit NOT NULL CONSTRAINT "DF_5360c0abf725ff4b42678a78ae5" DEFAULT 0, "isCompleted" bit NOT NULL CONSTRAINT "DF_de58bfa00b80f4f255bf9a3566c" DEFAULT 0, "url" nvarchar(255), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_88239a9fd84dd0ac520ec40b9da" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_fb5a82f6cf6cc727437ed7eb3b5" DEFAULT getdate(), "userId" int, "labelId" int, CONSTRAINT "PK_ea320dbd04b37ad98f9ff5033f6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "label" ("id" int NOT NULL IDENTITY(1,1), "key" nvarchar(255) NOT NULL, "description" nvarchar(255), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_29d5013d3994213bf3729548ce1" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_95f378e14262fe556d96f95cd3c" DEFAULT getdate(), "userTaskId" int, CONSTRAINT "PK_5692ac5348861d3776eb5843672" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "crm_task" ("id" int NOT NULL IDENTITY(1,1), "taskId" int NOT NULL, "dateTime" datetime NOT NULL CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1711624987013, "dueDateTime" datetime, "isForced" bit NOT NULL CONSTRAINT "DF_79cb74e7cc15812065208fd040d" DEFAULT 0, "url" nvarchar(255) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_94b4a90096ee19caee7881abc0b" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_588c6c13206226f56cabfb15a16" DEFAULT getdate(), "userId" int, CONSTRAINT "PK_f90d3810095adbfd24374df4d0f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "master_task" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "description" nvarchar(255), "masterUrl" nvarchar(255), "predecessor" int, "successor" int, "isForcedComplete" bit NOT NULL CONSTRAINT "DF_4aabc6a06ab4854ebfa123105bb" DEFAULT 0, "sla" int, "responsible" nvarchar(255), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_cbeeb9fa2ffc37730b8d119c95e" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_3512301a771ecc7b9fb56a8642f" DEFAULT getdate(), "labelId" int, CONSTRAINT "PK_e5ac5e780b4ad6b99886ea22ca6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_cbfc497407f7a7c989fea7588a" ON "master_task" ("labelId") WHERE "labelId" IS NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "FK_4df8c371c74decf9ef093358dad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "FK_2564f95332f9027d30e89bc6cb0" FOREIGN KEY ("labelId") REFERENCES "label"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "label" ADD CONSTRAINT "FK_95b51e724358ed4a38159645135" FOREIGN KEY ("userTaskId") REFERENCES "user_task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "FK_05654046ee5604f6f265eab9206" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_task" ADD CONSTRAINT "FK_cbfc497407f7a7c989fea7588a3" FOREIGN KEY ("labelId") REFERENCES "label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_task" DROP CONSTRAINT "FK_cbfc497407f7a7c989fea7588a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "FK_05654046ee5604f6f265eab9206"`,
    );
    await queryRunner.query(
      `ALTER TABLE "label" DROP CONSTRAINT "FK_95b51e724358ed4a38159645135"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "FK_2564f95332f9027d30e89bc6cb0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "FK_4df8c371c74decf9ef093358dad"`,
    );
    await queryRunner.query(
      `DROP INDEX "REL_cbfc497407f7a7c989fea7588a" ON "master_task"`,
    );
    await queryRunner.query(`DROP TABLE "master_task"`);
    await queryRunner.query(`DROP TABLE "crm_task"`);
    await queryRunner.query(`DROP TABLE "label"`);
    await queryRunner.query(`DROP TABLE "user_task"`);
    await queryRunner.query(`DROP TABLE "label_translation"`);
  }
}
