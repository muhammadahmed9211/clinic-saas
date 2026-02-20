import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedTransactionInBonusReward1761814661632 implements MigrationInterface {
    name = 'AddedTransactionInBonusReward1761814661632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bonus_reward" DROP CONSTRAINT "UQ_6a1c7712dfee183501796791401"`);
        await queryRunner.query(`ALTER TABLE "bonus_reward" ADD CONSTRAINT "UQ_170ca6fc0935c16adcab91cae2f" UNIQUE ("transactionId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
``