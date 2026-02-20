import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTicketDeskCategory1747310071091 implements MigrationInterface {
    name = 'AlterTicketDeskCategory1747310071091'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket_category_desk" ADD "isDefaultDesk" bit NOT NULL CONSTRAINT "DF_9b583c9471bd1f842afc1fc96f8" DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket_category_desk" DROP CONSTRAINT "DF_9b583c9471bd1f842afc1fc96f8"`);
        await queryRunner.query(`ALTER TABLE "ticket_category_desk" DROP COLUMN "isDefaultDesk"`);
    }

}
