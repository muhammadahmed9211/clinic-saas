import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailAttachments1737624170522 implements MigrationInterface {
    name = 'EmailAttachments1737624170522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_attachments" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_e11a47d59e6c93a48cd3832ab94" DEFAULT NEWSEQUENTIALID(), "path" nvarchar(255) NOT NULL, "fileSize" nvarchar(255), "fileType" nvarchar(255), "fileName" nvarchar(255), "created_at" datetime NOT NULL CONSTRAINT "DF_0b9d1eb940764477e435e108b3f" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_02666c8fb9fcaf23b158f40d7a7" DEFAULT getdate(), "deleted_at" datetime, "messageId" nvarchar(255), CONSTRAINT "PK_e11a47d59e6c93a48cd3832ab94" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "inbox_email" ADD CONSTRAINT "UQ_d97c9340ddf52ef741bddc8a0d7" UNIQUE ("messageId")`)
        await queryRunner.query(`ALTER TABLE "email_attachments" ADD CONSTRAINT "FK_f782ba00e93088a4a73a01ed28a" FOREIGN KEY ("messageId") REFERENCES "inbox_email"("messageId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_attachments" DROP CONSTRAINT "FK_f782ba00e93088a4a73a01ed28a"`);
        await queryRunner.query(`ALTER TABLE "inbox_email" DROP CONSTRAINT "UQ_d97c9340ddf52ef741bddc8a0d7"`);
        await queryRunner.query(`DROP TABLE "email_attachments"`);
    }

}