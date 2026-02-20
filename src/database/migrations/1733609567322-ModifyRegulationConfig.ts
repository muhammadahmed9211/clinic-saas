import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyRegulationConfig1733609567322 implements MigrationInterface {
  name = 'ModifyRegulationConfig1733609567322';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "regulation_event" ("id" int NOT NULL IDENTITY(1,1), "key" nvarchar(255) NOT NULL, "title" nvarchar(255) NOT NULL, "description" nvarchar(255), "isDeleted" bit NOT NULL CONSTRAINT "DF_090be6f857f44877948a6f3abe3" DEFAULT 0, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_f55a1c28064525666433104bf6e" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_db01d3fa7a49ab0077c7911b115" DEFAULT getdate(), CONSTRAINT "UQ_c241768095e33b51cf9a46f5dcf" UNIQUE ("key"), CONSTRAINT "PK_88cefbb03485ea4cf06137a7b3d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "regulation_rule" ("id" int NOT NULL IDENTITY(1,1), "type" varchar(255) NOT NULL CONSTRAINT "DF_a8c27e3699d3e31cc5bb6286222" DEFAULT 'boolean', "key" nvarchar(255) NOT NULL, "label" nvarchar(255) NOT NULL, "description" nvarchar(255), "defaultValue" nvarchar(255) NOT NULL, "isDeleted" bit NOT NULL CONSTRAINT "DF_cd05014af60404cb3cc768363bb" DEFAULT 0, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_e8ff55212481ea01a1359b10788" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_bf8d307f87644a26811334c5008" DEFAULT getdate(), CONSTRAINT "UQ_74aec1a0079e69125071ae1cd01" UNIQUE ("key"), CONSTRAINT "PK_aff7b0edd97605c26a81c5173a1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "regulation_event_rule_mapping" ("id" int NOT NULL IDENTITY(1,1), "value" nvarchar(255) NOT NULL, "isDeleted" bit NOT NULL CONSTRAINT "DF_a4bdb1a2c214e9b0f7c309b33b2" DEFAULT 0, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_c7538b4001a9262183c3bbb185b" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_e6f0ea5f42630551cb8e44f7adc" DEFAULT getdate(), "regulationId" int, "eventId" int, "ruleId" int, CONSTRAINT "UQ_bb3b1b0cb3f174469c5273ee72a" UNIQUE ("regulationId", "eventId", "ruleId"), CONSTRAINT "PK_311043c66727462e1b82c4231cf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulation_event_rule_mapping" ADD CONSTRAINT "FK_72750c5c77de19b8589a160c658" FOREIGN KEY ("regulationId") REFERENCES "regulations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulation_event_rule_mapping" ADD CONSTRAINT "FK_d559f75faedb31b455800bb0e10" FOREIGN KEY ("eventId") REFERENCES "regulation_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulation_event_rule_mapping" ADD CONSTRAINT "FK_b3ce4c936dba64ae62080c2579b" FOREIGN KEY ("ruleId") REFERENCES "regulation_rule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "regulation_event_rule_mapping" DROP CONSTRAINT "FK_b3ce4c936dba64ae62080c2579b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulation_event_rule_mapping" DROP CONSTRAINT "FK_d559f75faedb31b455800bb0e10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulation_event_rule_mapping" DROP CONSTRAINT "FK_72750c5c77de19b8589a160c658"`,
    );
    await queryRunner.query(`DROP TABLE "regulation_event_rule_mapping"`);
    await queryRunner.query(`DROP TABLE "regulation_rule"`);
    await queryRunner.query(`DROP TABLE "regulation_event"`);
  }
}
