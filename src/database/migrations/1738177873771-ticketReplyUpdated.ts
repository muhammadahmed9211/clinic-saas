import { MigrationInterface, QueryRunner } from "typeorm";

export class TicketReplyUpdated1738177873771 implements MigrationInterface {
    name = 'TicketReplyUpdated1738177873771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket_replies" ADD "to" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "ticket_replies" ADD "from" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "ticket_replies" ADD "cc" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "ticket_replies" ADD "bcc" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "ticket_replies" ADD "messageId" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "ticket_replies" ADD "platform" nvarchar(255) NOT NULL CONSTRAINT "DF_2a2a31f5ce92aa726e590f712d4" DEFAULT 'portal'`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "platform" nvarchar(255) NOT NULL CONSTRAINT "DF_96fd8e49844b8cf6257d8809d1c" DEFAULT 'portal'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "DF_96fd8e49844b8cf6257d8809d1c"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "platform"`);
        await queryRunner.query(`ALTER TABLE "ticket_replies" DROP CONSTRAINT "DF_2a2a31f5ce92aa726e590f712d4"`);
        await queryRunner.query(`ALTER TABLE "ticket_replies" DROP COLUMN "platform"`);
        await queryRunner.query(`ALTER TABLE "ticket_replies" DROP COLUMN "messageId"`);
        await queryRunner.query(`ALTER TABLE "ticket_replies" DROP COLUMN "bcc"`);
        await queryRunner.query(`ALTER TABLE "ticket_replies" DROP COLUMN "cc"`);
        await queryRunner.query(`ALTER TABLE "ticket_replies" DROP COLUMN "from"`);
        await queryRunner.query(`ALTER TABLE "ticket_replies" DROP COLUMN "to"`);
    }

}