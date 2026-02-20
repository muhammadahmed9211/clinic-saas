import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterIsFtdInTransaction1736420566450 implements MigrationInterface {
    name = 'AlterIsFtdInTransaction1736420566450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "isFtd"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "isFtd" bit NOT NULL CONSTRAINT "DF_004743168487e3e4126a5b63686" DEFAULT 0`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "isFtd"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "isFtd" tinyint`);
    }

}
