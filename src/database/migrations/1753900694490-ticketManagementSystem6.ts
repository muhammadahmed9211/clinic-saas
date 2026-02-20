import { MigrationInterface, QueryRunner } from "typeorm";

export class TicketManagementSystem61753900694490 implements MigrationInterface {
    name = 'TicketManagementSystem61753900694490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_attachments" ADD "isInline" bit NOT NULL CONSTRAINT "DF_ec066d8a0dfc79e9ba1f93f2790" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "email_attachments" ADD "contentId" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "to" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "cc" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "bcc" nvarchar(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "bcc"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "cc"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "to"`);
        await queryRunner.query(`ALTER TABLE "email_attachments" DROP COLUMN "contentId"`);
        await queryRunner.query(`ALTER TABLE "email_attachments" DROP CONSTRAINT "DF_ec066d8a0dfc79e9ba1f93f2790"`);
        await queryRunner.query(`ALTER TABLE "email_attachments" DROP COLUMN "isInline"`);
    }

}
