import { MigrationInterface, QueryRunner } from "typeorm";

export class PartnerGroup1751542102705 implements MigrationInterface {
    name = 'PartnerGroup1751542102705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner_trading_groups" ADD "regulationId" int`);
        await queryRunner.query(`ALTER TABLE "partner_trading_groups" ADD CONSTRAINT "FK_29eb988b2eceb5aa51bbcbb92ef" FOREIGN KEY ("regulationId") REFERENCES "regulations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner_trading_groups" DROP CONSTRAINT "FK_29eb988b2eceb5aa51bbcbb92ef"`);
        await queryRunner.query(`ALTER TABLE "partner_trading_groups" DROP COLUMN "regulationId"`);
    }

}
