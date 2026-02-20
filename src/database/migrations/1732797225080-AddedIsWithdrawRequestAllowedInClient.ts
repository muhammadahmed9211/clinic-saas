import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIsWithdrawRequestAllowedInClient1732797225080 implements MigrationInterface {
    name = 'AddedIsWithdrawRequestAllowedInClient1732797225080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "isWithdrawRequestAllowed" bit NOT NULL CONSTRAINT "DF_ea04dbd9446c3f3e4fad91616f1" DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "isWithdrawRequestAllowed"`);
    }

}
