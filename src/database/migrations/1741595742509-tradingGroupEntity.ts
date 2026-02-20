import { MigrationInterface, QueryRunner } from "typeorm";

export class TradingGroupEntity1741595742509 implements MigrationInterface {
    name = 'TradingGroupEntity1741595742509'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner_trading_groups" ADD "copyTradingGroup" nvarchar(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner_trading_groups" DROP COLUMN "copyTradingGroup"`);
    }

}
