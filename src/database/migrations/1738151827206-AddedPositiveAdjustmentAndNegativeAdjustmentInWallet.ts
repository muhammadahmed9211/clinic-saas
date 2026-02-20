import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPositiveAdjustmentAndNegativeAdjustmentInWallet1738151827206 implements MigrationInterface {
    name = 'AddedPositiveAdjustmentAndNegativeAdjustmentInWallet1738151827206'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" ADD "negativeAdjustment" float NOT NULL CONSTRAINT "DF_62bc26c6989c73295ad356aa0a6" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD "positiveAdjustment" float NOT NULL CONSTRAINT "DF_53ec5157acf0b01ea3d1fbee7ed" DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "positiveAdjustment"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "negativeAdjustment"`);
    }

}
