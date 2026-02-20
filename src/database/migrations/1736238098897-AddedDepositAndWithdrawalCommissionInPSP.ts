import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedDepositAndWithdrawalCommissionInPSP1736238098897 implements MigrationInterface {
    name = 'AddedDepositAndWithdrawalCommissionInPSP1736238098897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "psp" ADD "depositCommissionType" nvarchar(255) NOT NULL CONSTRAINT "DF_ac612ba58db5a6475cbdbc00ddf" DEFAULT 'AMOUNT'`);
        await queryRunner.query(`ALTER TABLE "psp" ADD "depositCommission" float NOT NULL CONSTRAINT "DF_979b0e9df1a6d4820ad44af3d96" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "psp" ADD "withdrawalCommissionType" nvarchar(255) NOT NULL CONSTRAINT "DF_9cbec389570f84463d5ab4043c4" DEFAULT 'AMOUNT'`);
        await queryRunner.query(`ALTER TABLE "psp" ADD "withdrawalCommission" float NOT NULL CONSTRAINT "DF_1733144f66f4fd20dba835e4765" DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "psp" DROP CONSTRAINT "DF_1733144f66f4fd20dba835e4765"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "withdrawalCommission"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP CONSTRAINT "DF_9cbec389570f84463d5ab4043c4"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "withdrawalCommissionType"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP CONSTRAINT "DF_979b0e9df1a6d4820ad44af3d96"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "depositCommission"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP CONSTRAINT "DF_ac612ba58db5a6475cbdbc00ddf"`);
        await queryRunner.query(`ALTER TABLE "psp" DROP COLUMN "depositCommissionType"`);
    }

}
