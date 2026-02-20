import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedKeysForPaymentRangesInMethodTable1733921596311 implements MigrationInterface {
    name = 'AddedKeysForPaymentRangesInMethodTable1733921596311'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_method" ADD "depositFeeType" nvarchar(255) NOT NULL CONSTRAINT "DF_389f60d13a7ce322ab7b6bdda3d" DEFAULT 'AMOUNT'`);
        await queryRunner.query(`ALTER TABLE "transaction_method" ADD "depositFeeStart" float NOT NULL CONSTRAINT "DF_e504bec0d0aa253a3b2d64f9cc1" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "transaction_method" ADD "depositFeeEnd" float NOT NULL CONSTRAINT "DF_f9d1d551a5efdb565f9f51ced55" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "transaction_method" ADD "withdrawalFeeType" nvarchar(255) NOT NULL CONSTRAINT "DF_8b53d0c9e0dbc62a41eab7a0a3a" DEFAULT 'AMOUNT'`);
        await queryRunner.query(`ALTER TABLE "transaction_method" ADD "withdrawalFeeStart" float NOT NULL CONSTRAINT "DF_2461723292c8c1634dcb58dd0b8" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "transaction_method" ADD "withdrawalFeeEnd" float NOT NULL CONSTRAINT "DF_1b2e62e1eae43304f70c2a75b45" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "transaction_method" ADD "clientDepositFeeType" nvarchar(255) NOT NULL CONSTRAINT "DF_2beae47f197dddd33e156d4ef91" DEFAULT 'AMOUNT'`);
        await queryRunner.query(`ALTER TABLE "transaction_method" ADD "clientDepositFeeStart" float NOT NULL CONSTRAINT "DF_7e746e134b3e2f7de9fab687a21" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "transaction_method" ADD "clientDepositFeeEnd" float NOT NULL CONSTRAINT "DF_6ad9584effcf4f20feda2c474f0" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "transaction_method" ADD "clientWithdrawalFeeType" nvarchar(255) NOT NULL CONSTRAINT "DF_b95c70f0fac1be9699209ca0286" DEFAULT 'AMOUNT'`);
        await queryRunner.query(`ALTER TABLE "transaction_method" ADD "clientWithdrawalFeeStart" float NOT NULL CONSTRAINT "DF_0566fa6e429092c18633a66d16d" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "transaction_method" ADD "clientWithdrawalFeeEnd" float NOT NULL CONSTRAINT "DF_cd63456a9f7978b2bcb4f78be27" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "transaction_method" ADD "depositLimit" float NOT NULL CONSTRAINT "DF_48068eb3e411bc5676a5674c40d" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "transaction_method" ADD "withdrawalLimit" float NOT NULL CONSTRAINT "DF_eefb2f0df6cabd701a3a80422d4" DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP CONSTRAINT "DF_eefb2f0df6cabd701a3a80422d4"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP COLUMN "withdrawalLimit"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP CONSTRAINT "DF_48068eb3e411bc5676a5674c40d"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP COLUMN "depositLimit"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP CONSTRAINT "DF_cd63456a9f7978b2bcb4f78be27"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP COLUMN "clientWithdrawalFeeEnd"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP CONSTRAINT "DF_0566fa6e429092c18633a66d16d"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP COLUMN "clientWithdrawalFeeStart"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP CONSTRAINT "DF_b95c70f0fac1be9699209ca0286"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP COLUMN "clientWithdrawalFeeType"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP CONSTRAINT "DF_6ad9584effcf4f20feda2c474f0"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP COLUMN "clientDepositFeeEnd"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP CONSTRAINT "DF_7e746e134b3e2f7de9fab687a21"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP COLUMN "clientDepositFeeStart"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP CONSTRAINT "DF_2beae47f197dddd33e156d4ef91"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP COLUMN "clientDepositFeeType"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP CONSTRAINT "DF_1b2e62e1eae43304f70c2a75b45"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP COLUMN "withdrawalFeeEnd"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP CONSTRAINT "DF_2461723292c8c1634dcb58dd0b8"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP COLUMN "withdrawalFeeStart"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP CONSTRAINT "DF_8b53d0c9e0dbc62a41eab7a0a3a"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP COLUMN "withdrawalFeeType"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP CONSTRAINT "DF_f9d1d551a5efdb565f9f51ced55"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP COLUMN "depositFeeEnd"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP CONSTRAINT "DF_e504bec0d0aa253a3b2d64f9cc1"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP COLUMN "depositFeeStart"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP CONSTRAINT "DF_389f60d13a7ce322ab7b6bdda3d"`);
        await queryRunner.query(`ALTER TABLE "transaction_method" DROP COLUMN "depositFeeType"`);
    }

}
