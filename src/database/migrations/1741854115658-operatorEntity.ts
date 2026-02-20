import { MigrationInterface, QueryRunner } from "typeorm";

export class OperatorEntity1741854115658 implements MigrationInterface {
    name = 'OperatorEntity1741854115658'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operator" ADD "autoMonthlyTarget" bit NOT NULL CONSTRAINT "DF_16b82fc7c295c823c6db8b3c7bc" DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "autoMonthlyTarget"`);
    }

}
