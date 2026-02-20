import { MigrationInterface, QueryRunner } from "typeorm";

export class TicketManagementSystem61752850549567 implements MigrationInterface {
    name = 'TicketManagementSystem61752850549567'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_list" ADD "ticketCategoryId" int`);
        await queryRunner.query(`ALTER TABLE "email_list" ADD CONSTRAINT "FK_099c43dc7860e0fe01cd0f6a795" FOREIGN KEY ("ticketCategoryId") REFERENCES "ticket_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_list" DROP CONSTRAINT "FK_099c43dc7860e0fe01cd0f6a795"`);
        await queryRunner.query(`ALTER TABLE "email_list" DROP COLUMN "ticketCategoryId"`);
    }

}
