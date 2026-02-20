import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTicketCreatedBy1733497886634 implements MigrationInterface {
    name = 'AddTicketCreatedBy1733497886634'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" ADD "createdById" int`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_41de538b3eed286f53dd678b030" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_41de538b3eed286f53dd678b030"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "createdById"`);
    }

}
