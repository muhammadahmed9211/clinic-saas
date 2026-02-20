import { MigrationInterface, QueryRunner } from "typeorm";

export class Otpisverified1729757064878 implements MigrationInterface {
    name = 'Otpisverified1729757064878'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otp" ADD "isVerified" bit NOT NULL CONSTRAINT "DF_6c6adff9e71255a7ad016d62ce4" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "otp" ADD "verifiedAt" datetime`);
        await queryRunner.query(`ALTER TABLE "otp" ADD "entityId" varchar(40)`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otp" DROP CONSTRAINT "DF_6c6adff9e71255a7ad016d62ce4"`);
        await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "isVerified"`);
        await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "verifiedAt"`);
        await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "entityId"`);

    }

}
