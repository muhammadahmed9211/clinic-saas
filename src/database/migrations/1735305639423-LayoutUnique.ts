import { MigrationInterface, QueryRunner } from "typeorm";

export class LayoutUnique1735305639423 implements MigrationInterface {
    name = 'LayoutUnique1735305639423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "layout" DROP CONSTRAINT "UQ_837861749b4aa22054a95b56e07"`);
        await queryRunner.query(`ALTER TABLE "layout" ADD CONSTRAINT "UQ_42a9ca31c13ba34dc170379d0e9" UNIQUE ("name", "language", "companyName", "deletedAt")`);
        }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "layout" DROP CONSTRAINT "UQ_42a9ca31c13ba34dc170379d0e9"`);
        await queryRunner.query(`ALTER TABLE "layout" ADD CONSTRAINT "UQ_837861749b4aa22054a95b56e07" UNIQUE ("companyName", "deletedAt", "language", "regulationIdId")`);
       }

}
