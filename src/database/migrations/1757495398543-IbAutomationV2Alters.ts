import { MigrationInterface, QueryRunner } from "typeorm";

export class IbAutomationV2Alters1757495398543 implements MigrationInterface {
    name = 'IbAutomationV2Alters1757495398543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ib_commission_profile" ADD "standardTradingGroup" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "ib_commission_profile" ADD "premierTradingGroup" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "ib_commission_profile" ADD "eliteTradingGroup" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "partner_trading_groups" ADD "premierTradingGroup" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "partner_trading_groups" ADD "premierTradingGroupSw" nvarchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "partner_trading_groups" ADD "eliteTradingGroup" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "partner_trading_groups" ADD "eliteTradingGroupSw" nvarchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "partner_links" ADD "classification" text`);
        await queryRunner.query(`CREATE TABLE "partner_commission_profile" ("id" int NOT NULL IDENTITY(1,1), "partnerId" int, "commissionProfileId" int, CONSTRAINT "PK_7ab359798627e8c65544e60ffde" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "partner_commission_profile" ADD CONSTRAINT "FK_dd732ce2f4861f1c2ac85bd8803" FOREIGN KEY ("partnerId") REFERENCES "partner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partner_commission_profile" ADD CONSTRAINT "FK_3c556fac99d569d43dba9d8e056" FOREIGN KEY ("commissionProfileId") REFERENCES "ib_commission_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mt5_account" ADD "commissionProfileId" int`);
        await queryRunner.query(`ALTER TABLE "mt5_account" ADD CONSTRAINT "FK_7a1d207f392d7195cec476f035a" FOREIGN KEY ("commissionProfileId") REFERENCES "ib_commission_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner_trading_groups" DROP COLUMN "eliteTradingGroupSw"`);
        await queryRunner.query(`ALTER TABLE "partner_trading_groups" DROP COLUMN "eliteTradingGroup"`);
        await queryRunner.query(`ALTER TABLE "partner_trading_groups" DROP COLUMN "premierTradingGroupSw"`);
        await queryRunner.query(`ALTER TABLE "partner_trading_groups" DROP COLUMN "premierTradingGroup"`);
        await queryRunner.query(`ALTER TABLE "ib_commission_profile" DROP COLUMN "eliteTradingGroup"`);
        await queryRunner.query(`ALTER TABLE "ib_commission_profile" DROP COLUMN "premierTradingGroup"`);
        await queryRunner.query(`ALTER TABLE "ib_commission_profile" DROP COLUMN "standardTradingGroup"`);
        await queryRunner.query(`ALTER TABLE "partner_links" DROP COLUMN "classification"`);
        await queryRunner.query(`ALTER TABLE "partner_commission_profile" DROP CONSTRAINT "FK_3c556fac99d569d43dba9d8e056"`);
        await queryRunner.query(`ALTER TABLE "partner_commission_profile" DROP CONSTRAINT "FK_dd732ce2f4861f1c2ac85bd8803"`);
        await queryRunner.query(`DROP TABLE "partner_commission_profile"`);
    }

}
