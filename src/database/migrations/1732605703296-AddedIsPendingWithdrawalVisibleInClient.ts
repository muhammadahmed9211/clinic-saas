import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIsPendingWithdrawalVisibleInClient1732605703296 implements MigrationInterface {
    name = 'AddedIsPendingWithdrawalVisibleInClient1732605703296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "isPendingWithdrawalVisible" bit NOT NULL CONSTRAINT "DF_3c5a7f737115cd677663eadd31a" DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "isPendingWithdrawalVisible"`);
    }
}
