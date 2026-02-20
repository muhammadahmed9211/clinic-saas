import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedFtdAmountAndAdjustedFtdAmountInClientAndLead1734351679558 implements MigrationInterface {
    name = 'AddedFtdAmountAndAdjustedFtdAmountInClientAndLead1734351679558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "ftdAmount" int`);
        await queryRunner.query(`ALTER TABLE "client" ADD "adjustedFtdAmount" int`);
        await queryRunner.query(`ALTER TABLE "lead" ADD "ftdAmount" int`);
        await queryRunner.query(`ALTER TABLE "lead" ADD "adjustedFtdAmount" int`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "adjustedFtdAmount"`);
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "ftdAmount"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "adjustedFtdAmount"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "ftdAmount"`);
    }

}
