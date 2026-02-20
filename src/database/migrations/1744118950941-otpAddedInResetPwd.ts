import { MigrationInterface, QueryRunner } from "typeorm";

export class OtpAddedInResetPwd1744118950941 implements MigrationInterface {
    name = 'OtpAddedInResetPwd1744118950941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reset_password" ADD "otp" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "reset_password" DROP COLUMN "expireAt"`);
        await queryRunner.query(`ALTER TABLE "reset_password" ADD "expireAt" datetime`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reset_password" DROP COLUMN "expireAt"`);
        await queryRunner.query(`ALTER TABLE "reset_password" ADD "expireAt" datetime2`);
        await queryRunner.query(`ALTER TABLE "reset_password" DROP COLUMN "otp"`);
    }

}
