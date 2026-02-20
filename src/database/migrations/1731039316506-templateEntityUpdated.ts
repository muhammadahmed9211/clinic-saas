import { MigrationInterface, QueryRunner } from "typeorm";

export class TemplateEntityUpdated1731039316506 implements MigrationInterface {
    name = 'TemplateEntityUpdated1731039316506'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "template" ADD "version" nvarchar(255) NOT NULL CONSTRAINT "DF_1a4d21610bf2a9221fd20028615" DEFAULT 'v1'`);
        await queryRunner.query(`ALTER TABLE "template" ADD "entityId" int`);
        await queryRunner.query(`ALTER TABLE "template" ADD CONSTRAINT "FK_168eee7df4119515be8d3152b8d" FOREIGN KEY ("entityId") REFERENCES "email_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "template" DROP CONSTRAINT "FK_168eee7df4119515be8d3152b8d"`);
        await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "entityId"`);
        await queryRunner.query(`ALTER TABLE "template" DROP CONSTRAINT "DF_1a4d21610bf2a9221fd20028615"`);
        await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "version"`);
    }

}
