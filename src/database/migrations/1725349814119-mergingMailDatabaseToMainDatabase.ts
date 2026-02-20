import { MigrationInterface, QueryRunner } from 'typeorm';

export class MergingMailDatabaseToMainDatabase1725349814119
  implements MigrationInterface
{
  name = 'MergingMailDatabaseToMainDatabase1725349814119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "communication" ("id" int NOT NULL IDENTITY(1,1), "message_id" nvarchar(255), "text" text, "html" nvarchar(MAX), "subject" nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS, "type" nvarchar(255) CONSTRAINT CHK_bf8d66774c0bc608a3c2ff8723_ENUM CHECK(type IN ('email','sms','whatsapp')), "sender" nvarchar(255), "from" nvarchar(255), "userId" int, "leadId" int, "opportunityId" int, "operatorId" int, "created_at" datetime NOT NULL CONSTRAINT "DF_bc0c837110a416e48e7e0b2bf20" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_d1b86224742f915138a866a5a56" DEFAULT getdate(), "status" nvarchar(255) NOT NULL CONSTRAINT "DF_0901c57c6be21d1456e5213baaf" DEFAULT 'Pending', "starred" bit NOT NULL CONSTRAINT "DF_1fb21154093f0ad045bc9ca07f3" DEFAULT 0, "read" bit NOT NULL CONSTRAINT "DF_73fac66bbd042651fc43d783415" DEFAULT 0, "read_at" datetime, "is_delivered" bit NOT NULL CONSTRAINT "DF_dd163184357b6fa41ccc68a3764" DEFAULT 0, "sg_message_id" nvarchar(255), "template_id" int, CONSTRAINT "PK_392407b9e9100bee1a64e26cd5d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "template" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "communicationType" int NOT NULL, "eventId" int NOT NULL, "indexName" nvarchar(255) NOT NULL, "language" nvarchar(255) NOT NULL, "subIndexName" nvarchar(255) NOT NULL, "text" nvarchar(MAX) NOT NULL, "title" nvarchar(MAX) NOT NULL, "eventName" varchar(255), "subject" nvarchar(255), "domain" nvarchar(255), "isDeleted" bit NOT NULL CONSTRAINT "DF_174bbdfda9fae5387e6c897149e" DEFAULT 0, "trackingId" nvarchar(255) NOT NULL, "creationTime" datetime NOT NULL CONSTRAINT "DF_28116b83b81989b98a113e1f77b" DEFAULT getdate(), "lastUpdateTime" datetime2(6) NOT NULL CONSTRAINT "DF_ae543f6dd1bbc43324fa32080d6" DEFAULT SYSUTCDATETIME(), CONSTRAINT "UQ_d83776875e35b8fa06020fc1c52" UNIQUE ("name", "language", "domain"), CONSTRAINT "PK_fbae2ac36bd9b5e1e793b957b7f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "inbox_email" ("id" int NOT NULL IDENTITY(1,1), "messageId" nvarchar(255) NOT NULL, "subject" nvarchar(255), "body" nvarchar(max), "from" nvarchar(255), "receivedDateTime" datetime, "senderName" nvarchar(255), "emailId" int NOT NULL, CONSTRAINT "PK_6b7eba66eb7145f4a2911537bf1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "email_operations" ("id" int NOT NULL IDENTITY(1,1), "jobId" int, "metaData" nvarchar(max), "email_id" int, CONSTRAINT "PK_f244acf2ddd64ebc07611a46932" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_0e611aeb3275860c28907dd38e" ON "email_operations" ("email_id") WHERE "email_id" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "email_list" ("id" int NOT NULL IDENTITY(1,1), "code" nvarchar(255) NOT NULL, "email" nvarchar(255) NOT NULL, "created_at" datetime NOT NULL CONSTRAINT "DF_1d237c197e257080f7e0b390bcb" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_66d421337db304da91b245eea07" DEFAULT getdate(), "deleted_at" datetime, CONSTRAINT "PK_70780e70d69d6755543eb9ed74d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "layout" ("id" int NOT NULL IDENTITY(1,1), "companyName" nvarchar(255) NOT NULL, "layout" nvarchar(MAX) NOT NULL, "language" nvarchar(255) NOT NULL, "isActive" bit NOT NULL CONSTRAINT "DF_81e8e7012d0c6a45df5f4db714c" DEFAULT 1, "createdAt" datetime NOT NULL CONSTRAINT "DF_44685a79cef1080c1b2667ffce4" DEFAULT getdate(), "deletedAt" datetime2, "updatedAt" datetime NOT NULL CONSTRAINT "DF_7a5f23fecd292805ddaa1737bfc" DEFAULT getdate(), CONSTRAINT "PK_6e288ce489327c1ec1274d24942" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_agreements" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "userId" int NOT NULL, "type" nvarchar(255) NOT NULL, "path" nvarchar(255) NOT NULL, "sentTo" nvarchar(255) NOT NULL, "sentFrom" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_0b16ddada99d20f63dff2b2686c" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_d6a94bbb05fb1727d313d4e8695" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_40142c99b09d69434f28eb0ebdb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication" ADD CONSTRAINT "FK_7d692c979781abeb65e1ec553b4" FOREIGN KEY ("template_id") REFERENCES "template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_operations" ADD CONSTRAINT "FK_0e611aeb3275860c28907dd38ec" FOREIGN KEY ("email_id") REFERENCES "email_list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email_operations" DROP CONSTRAINT "FK_0e611aeb3275860c28907dd38ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication" DROP CONSTRAINT "FK_7d692c979781abeb65e1ec553b4"`,
    );
    await queryRunner.query(`DROP TABLE "user_agreements"`);
    await queryRunner.query(`DROP TABLE "layout"`);
    await queryRunner.query(`DROP TABLE "email_list"`);
    await queryRunner.query(
      `DROP INDEX "REL_0e611aeb3275860c28907dd38e" ON "email_operations"`,
    );
    await queryRunner.query(`DROP TABLE "email_operations"`);
    await queryRunner.query(`DROP TABLE "inbox_email"`);
    await queryRunner.query(`DROP TABLE "template"`);
    await queryRunner.query(`DROP TABLE "communication"`);
  }
}
