import { MigrationInterface, QueryRunner } from "typeorm";

export class TicketManagementSystem1751970348943 implements MigrationInterface {
    name = 'TicketManagementSystem1751970348943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ticket_replies" ("id" int NOT NULL IDENTITY(1,1), "title" nvarchar(max), "comment" nvarchar(max), "ticketId" int NOT NULL, "to" nvarchar(255), "from" nvarchar(255), "cc" nvarchar(255), "bcc" nvarchar(255), "messageId" nvarchar(255), "platform" nvarchar(255) NOT NULL CONSTRAINT "DF_2a2a31f5ce92aa726e590f712d4" DEFAULT 'portal', "attachments" nvarchar(255), "createdById" int NOT NULL, "createdAt" datetime CONSTRAINT "DF_8eadb20f5e803e584b47ad1c491" DEFAULT getdate(), "updatedAt" datetime CONSTRAINT "DF_498f964acf4142e9492ec424b6e" DEFAULT getdate(), "deleteAt" datetime, CONSTRAINT "PK_6ab133db0068322c649e89fc019" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ticket_category_desk" ("id" int NOT NULL IDENTITY(1,1), "ticket_category_id" int NOT NULL, "deskId" bigint NOT NULL, "isDefaultDesk" bit NOT NULL CONSTRAINT "DF_9b583c9471bd1f842afc1fc96f8" DEFAULT 0, CONSTRAINT "PK_8a6a8ae3b3d222f6986dce442b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ticket_category" ("id" int NOT NULL IDENTITY(1,1), "categories" nvarchar(255) NOT NULL, CONSTRAINT "PK_41d5bc6539e69677fb5f54fd80d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ticket_collaborators" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_3ea41e9b6c79a2b714a30d09cbe" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_90a9b64213346aa63f9046afa1e" DEFAULT getdate(), "deletedAt" datetime2, "ticketId" int, "collaboratorId" int, CONSTRAINT "PK_0beb8359a58d973b43dfad6797b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tickets" ("id" int NOT NULL IDENTITY(1,1), "title" nvarchar(255), "description" nvarchar(max), "category_id" int, "priority" nvarchar(255) CONSTRAINT CHK_efee7b6835b4dd4aa124bc19c5_ENUM CHECK(priority IN ('LOW','MEDIUM','HIGH')) CONSTRAINT "DF_1cfb61a749963bfba02395e118a" DEFAULT 'LOW', "status" nvarchar(255) CONSTRAINT CHK_d1d9d782ee3be7d62c9beea03b_ENUM CHECK(status IN ('OPEN','IN_PROGRESS','RESOLVED','CLOSED')) NOT NULL CONSTRAINT "DF_12b901b34113688b47863685106" DEFAULT 'OPEN', "ticketNumber" int, "userId" int, "attachments" nvarchar(255), "comments" nvarchar(max), "assigneeId" int, "createdFor" nvarchar(255) CONSTRAINT CHK_a240bd01734ebed758a5d565eb_ENUM CHECK(createdFor IN ('CLIENT','OPERATOR')) CONSTRAINT "DF_d99af3c0d92dcab3352d609cde3" DEFAULT 'OPERATOR', "deskId" bigint NOT NULL, "ticketType" nvarchar(255), "createdAt" datetime CONSTRAINT "DF_e5a32949aaaa731c7ec0dc89e97" DEFAULT getdate(), "updatedAt" datetime CONSTRAINT "DF_8a5aef5ed4de9ae4c02321160a4" DEFAULT getdate(), "resolvedAt" datetime CONSTRAINT "DF_e46b1f79ed55d6a6561e8829983" DEFAULT getdate(), "closedAt" datetime CONSTRAINT "DF_668d981588cda4aadc716e3f251" DEFAULT getdate(), "closedReason" nvarchar(255), "deleteAt" datetime, "crmLink" nvarchar(255), "clientLink" nvarchar(255), "platform" nvarchar(255) NOT NULL CONSTRAINT "DF_96fd8e49844b8cf6257d8809d1c" DEFAULT 'portal', "permanentlyClosed" bit CONSTRAINT "DF_0f4a196400e7042e1f8745a04e6" DEFAULT 0, "permanentlyClosedAt" datetime, "permanentlyClosedReason" nvarchar(255), "createdById" int, "createdForIdId" int, CONSTRAINT "PK_343bc942ae261cf7a1377f48fd0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "email_attachments" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_e11a47d59e6c93a48cd3832ab94" DEFAULT NEWSEQUENTIALID(), "path" nvarchar(255) NOT NULL, "fileSize" nvarchar(255), "fileType" nvarchar(255), "fileName" nvarchar(255), "created_at" datetime NOT NULL CONSTRAINT "DF_0b9d1eb940764477e435e108b3f" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_02666c8fb9fcaf23b158f40d7a7" DEFAULT getdate(), "deleted_at" datetime, "messageId" nvarchar(255), CONSTRAINT "PK_e11a47d59e6c93a48cd3832ab94" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "merged_tickets" ("id" int NOT NULL IDENTITY(1,1), "merge_group_id" uniqueidentifier NOT NULL, "ticket_id" int NOT NULL, "status" nvarchar(255) CONSTRAINT CHK_a1863c1229419ef16188ee7203_ENUM CHECK(status IN ('PRIMARY','SECONDARY')) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_3f9c64aadf90dd05519b0f66936" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_11e7865783319bfd767d18c2f01" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_169086c7489c4454e56faa3ede4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0cd59375c6dd1f8c02cfce2952" ON "merged_tickets" ("merge_group_id") `);
        await queryRunner.query(`ALTER TABLE "notes" ADD "ticketId" int`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isTicketUser" bit NOT NULL CONSTRAINT "DF_ae53f4233e16627d0fd93ea76e9" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "email_list" ADD "ticketConfigured" bit NOT NULL CONSTRAINT "DF_6b8390cd8f3f2fb574e24bdc735" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "ticket_replies" ADD CONSTRAINT "FK_27ddc67c44b9eaaed06320de140" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_replies" ADD CONSTRAINT "FK_6983c82029e4e2097d6cd5d5bf7" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_category_desk" ADD CONSTRAINT "FK_f27aff036fd5d6c38a5e2814f50" FOREIGN KEY ("ticket_category_id") REFERENCES "ticket_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_category_desk" ADD CONSTRAINT "FK_745a42357a765207f784ecbff2e" FOREIGN KEY ("deskId") REFERENCES "desk"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_collaborators" ADD CONSTRAINT "FK_e206b45c958ddf377c011665a51" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_collaborators" ADD CONSTRAINT "FK_0fd1d6286bb58bda2cc6267c3fd" FOREIGN KEY ("collaboratorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_32a7f0e4e32a46a094b55f7c25c" FOREIGN KEY ("category_id") REFERENCES "ticket_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_4f127f7c92139971ec4cbbe0bd5" FOREIGN KEY ("assigneeId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_41de538b3eed286f53dd678b030" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_bee9aa220bceadc436a54a16422" FOREIGN KEY ("createdForIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_710a58fc35dcf479baaf92d42a1" FOREIGN KEY ("deskId") REFERENCES "desk"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_f80032c315b0bfe15e51a7ad950" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "merged_tickets" ADD CONSTRAINT "FK_2e777c95c7ad48fdd5111f1f16d" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merged_tickets" DROP CONSTRAINT "FK_2e777c95c7ad48fdd5111f1f16d"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_f80032c315b0bfe15e51a7ad950"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_710a58fc35dcf479baaf92d42a1"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_bee9aa220bceadc436a54a16422"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_41de538b3eed286f53dd678b030"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_4f127f7c92139971ec4cbbe0bd5"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_32a7f0e4e32a46a094b55f7c25c"`);
        await queryRunner.query(`ALTER TABLE "ticket_collaborators" DROP CONSTRAINT "FK_0fd1d6286bb58bda2cc6267c3fd"`);
        await queryRunner.query(`ALTER TABLE "ticket_collaborators" DROP CONSTRAINT "FK_e206b45c958ddf377c011665a51"`);
        await queryRunner.query(`ALTER TABLE "ticket_category_desk" DROP CONSTRAINT "FK_745a42357a765207f784ecbff2e"`);
        await queryRunner.query(`ALTER TABLE "ticket_category_desk" DROP CONSTRAINT "FK_f27aff036fd5d6c38a5e2814f50"`);
        await queryRunner.query(`ALTER TABLE "ticket_replies" DROP CONSTRAINT "FK_6983c82029e4e2097d6cd5d5bf7"`);
        await queryRunner.query(`ALTER TABLE "ticket_replies" DROP CONSTRAINT "FK_27ddc67c44b9eaaed06320de140"`);
        await queryRunner.query(`ALTER TABLE "email_list" DROP CONSTRAINT "DF_6b8390cd8f3f2fb574e24bdc735"`);
        await queryRunner.query(`ALTER TABLE "email_list" DROP COLUMN "ticketConfigured"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_ae53f4233e16627d0fd93ea76e9"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isTicketUser"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "ticketId"`);
        await queryRunner.query(`DROP INDEX "IDX_0cd59375c6dd1f8c02cfce2952" ON "merged_tickets"`);
        await queryRunner.query(`DROP TABLE "merged_tickets"`);
        await queryRunner.query(`DROP TABLE "email_attachments"`);
        await queryRunner.query(`DROP TABLE "ib_links"`);
        await queryRunner.query(`DROP TABLE "tickets"`);
        await queryRunner.query(`DROP TABLE "ticket_collaborators"`);
        await queryRunner.query(`DROP TABLE "ticket_category"`);
        await queryRunner.query(`DROP TABLE "ticket_category_desk"`);
        await queryRunner.query(`DROP TABLE "ticket_replies"`);
    }

}
