import { MigrationInterface, QueryRunner } from "typeorm";

export class TargetAlter1727955238440 implements MigrationInterface {
    name = 'TargetAlter1727955238440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operator_targets" DROP CONSTRAINT "DF_91c36f878ab726f711e2b7aadbc"`);
        await queryRunner.query(`ALTER TABLE "operator_targets" DROP COLUMN "w01_deposit"`);
        await queryRunner.query(`ALTER TABLE "operator_targets" DROP CONSTRAINT "DF_f8bd6217ccfa7c204c157cfbbc0"`);
        await queryRunner.query(`ALTER TABLE "operator_targets" DROP COLUMN "w02_deposit"`);
        await queryRunner.query(`ALTER TABLE "operator_targets" DROP CONSTRAINT "DF_e0a7011ca9ba7987fe9869c72fb"`);
        await queryRunner.query(`ALTER TABLE "operator_targets" DROP COLUMN "w03_deposit"`);
        await queryRunner.query(`ALTER TABLE "operator_targets" DROP CONSTRAINT "DF_63c67359b93b19a1aa3ea277d7b"`);
        await queryRunner.query(`ALTER TABLE "operator_targets" DROP COLUMN "w04_deposit"`);
        await queryRunner.query(`ALTER TABLE "operator_targets" ADD "is_hidden" bit NOT NULL CONSTRAINT "DF_0bf8b83b2ba7c26690d9d373963" DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operator_targets" DROP CONSTRAINT "DF_0bf8b83b2ba7c26690d9d373963"`);
        await queryRunner.query(`ALTER TABLE "operator_targets" DROP COLUMN "is_hidden"`);
        await queryRunner.query(`ALTER TABLE "operator_targets" ADD "w04_deposit" float`);
        await queryRunner.query(`ALTER TABLE "operator_targets" ADD CONSTRAINT "DF_63c67359b93b19a1aa3ea277d7b" DEFAULT 0 FOR "w04_deposit"`);
        await queryRunner.query(`ALTER TABLE "operator_targets" ADD "w03_deposit" float`);
        await queryRunner.query(`ALTER TABLE "operator_targets" ADD CONSTRAINT "DF_e0a7011ca9ba7987fe9869c72fb" DEFAULT 0 FOR "w03_deposit"`);
        await queryRunner.query(`ALTER TABLE "operator_targets" ADD "w02_deposit" float`);
        await queryRunner.query(`ALTER TABLE "operator_targets" ADD CONSTRAINT "DF_f8bd6217ccfa7c204c157cfbbc0" DEFAULT 0 FOR "w02_deposit"`);
        await queryRunner.query(`ALTER TABLE "operator_targets" ADD "w01_deposit" float`);
        await queryRunner.query(`ALTER TABLE "operator_targets" ADD CONSTRAINT "DF_91c36f878ab726f711e2b7aadbc" DEFAULT 0 FOR "w01_deposit"`);
    }

}
