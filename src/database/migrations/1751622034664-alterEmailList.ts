import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterEmailList1751622034664 implements MigrationInterface {
    name = 'AlterEmailList1751622034664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_list" ADD "ticketConfigured" bit NOT NULL CONSTRAINT "DF_6b8390cd8f3f2fb574e24bdc735" DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_list" DROP COLUMN "ticketConfigured"`);
    }

}
