import { MigrationInterface, QueryRunner } from "typeorm";

export class UserEntityChanges1732693660223 implements MigrationInterface {
    name = 'UserEntityChanges1732693660223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "totp" bit NOT NULL CONSTRAINT "DF_4d1b78b0381c02abf0df96c5b0c" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "user" ADD "mobileOtp" bit NOT NULL CONSTRAINT "DF_bc3c248d2206c3970e422340dad" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "user" ADD "emailOtp" bit NOT NULL CONSTRAINT "DF_1c667a27cef9d4bcfc42284a38c" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "client" ADD "totp_key" varchar(255)`);
        await queryRunner.query(`ALTER TABLE "client" ADD "totp_key_url" varchar(255)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isTotpDefault" bit NOT NULL CONSTRAINT "DF_58979a130cbffde9981f3488ea5" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isMobileOtpDefault" bit NOT NULL CONSTRAINT "DF_5f5a3a3ca81123a68ffc80fac88" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isEmailOtpDefault" bit NOT NULL CONSTRAINT "DF_4c2c87c937946d68068011c89c3" DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_4c2c87c937946d68068011c89c3"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isEmailOtpDefault"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_5f5a3a3ca81123a68ffc80fac88"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isMobileOtpDefault"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_58979a130cbffde9981f3488ea5"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isTotpDefault"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "totp_key_url"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "totp_key"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_1c667a27cef9d4bcfc42284a38c"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailOtp"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_bc3c248d2206c3970e422340dad"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "mobileOtp"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_4d1b78b0381c02abf0df96c5b0c"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "totp"`);
    }

}
