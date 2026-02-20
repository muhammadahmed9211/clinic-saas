import { MigrationInterface, QueryRunner } from "typeorm";

export class TicketManagementSystem41752500392070 implements MigrationInterface {
    name = 'TicketManagementSystem41752500392070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" ADD "fromEmail" nvarchar(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "fromEmail"`);
    }

}
