import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedBalanceBeforeAndBalanceAfterInLedger1730116539001 implements MigrationInterface {
    name = 'AddedBalanceBeforeAndBalanceAfterInLedger1730116539001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ledger" ADD "balanceBefore" float`);
        await queryRunner.query(`ALTER TABLE "ledger" ADD "balanceAfter" float`);
        }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ledger" DROP COLUMN "balanceAfter"`);
        await queryRunner.query(`ALTER TABLE "ledger" DROP COLUMN "balanceBefore"`);
        }

}
