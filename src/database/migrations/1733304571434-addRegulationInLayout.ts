import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRegulationInLayout1733304571434 implements MigrationInterface {
    name = 'AddRegulationInLayout1733304571434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "layout" ADD "regulationIdId" int`);
        await queryRunner.query(`ALTER TABLE "layout" ADD CONSTRAINT "FK_765ad46699e5c41e2ae9d11bc27" FOREIGN KEY ("regulationIdId") REFERENCES "regulations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "layout" DROP CONSTRAINT "FK_765ad46699e5c41e2ae9d11bc27"`);
        await queryRunner.query(`ALTER TABLE "layout" DROP COLUMN "regulationIdId"`);
    }

}
