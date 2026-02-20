import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRegulationUnique1733308209462 implements MigrationInterface {
    name = 'AddRegulationUnique1733308209462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "layout" DROP CONSTRAINT "UQ_837861749b4aa22054a95b56e07"`);
        await queryRunner.query(`ALTER TABLE "layout" ADD CONSTRAINT "UQ_37ecd4d0113b028a4c59ffd9f43" UNIQUE ("regulationIdId", "language", "companyName", "deletedAt")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "layout" DROP CONSTRAINT "UQ_37ecd4d0113b028a4c59ffd9f43"`);
        await queryRunner.query(`ALTER TABLE "layout" ADD CONSTRAINT "UQ_837861749b4aa22054a95b56e07" UNIQUE ("companyName", "deletedAt", "language", "regulation")`);
    }

}
