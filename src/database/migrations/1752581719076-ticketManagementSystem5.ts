import { MigrationInterface, QueryRunner } from "typeorm";

export class TicketManagementSystem51752581719076 implements MigrationInterface {
    name = 'TicketManagementSystem51752581719076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" ADD "subject" nvarchar(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "subject"`);
    }

}
