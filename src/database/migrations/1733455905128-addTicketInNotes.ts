import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTicketInNotes1733455905128 implements MigrationInterface {
    name = 'AddTicketInNotes1733455905128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notes" ADD "ticketId" int`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_f80032c315b0bfe15e51a7ad950" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`); 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_f80032c315b0bfe15e51a7ad950"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "ticketId"`)
    }

}
