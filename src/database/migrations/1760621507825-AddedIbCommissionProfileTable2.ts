import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIbCommissionProfileTable21760621507825 implements MigrationInterface {
    name = 'AddedIbCommissionProfileTable21760621507825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "classification" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "description" nvarchar(255), "isActive" bit NOT NULL CONSTRAINT "DF_c575158e4b7282d9675e649e664" DEFAULT 1, "createdAt" datetime NOT NULL CONSTRAINT "DF_bb352e5734d9bbec32a8ea295d8" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_43d3aee8bbc50fc54166758ca20" DEFAULT getdate(), "deletedAt" datetime2, "titleId" int, CONSTRAINT "PK_1dc9176492b73104aa3d19ccff4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "trading_group" ADD "type" nvarchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trading_group" ADD "classificationId" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ib_commission_profile" ADD "classificationId" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ib_commission_profile" ADD "calculateCommission" bit NOT NULL CONSTRAINT "DF_c19202959a934e9fbbd1bc3292b" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "ib_commission_profile" ADD "tradingGroupId" int`);
        await queryRunner.query(`ALTER TABLE "ib_commission_profile" ADD "copyTradingGroupId" int`);
        await queryRunner.query(`ALTER TABLE "ib_commission_profile" ADD "agentTradingGroupId" int`);
        await queryRunner.query(`ALTER TABLE "client" ADD "registrationClassification" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "client" ADD "intendedClassification" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "classification" ADD CONSTRAINT "FK_81cfbb0f2a7001c531f15df087b" FOREIGN KEY ("titleId") REFERENCES "label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trading_group" ADD CONSTRAINT "FK_c5e223c2f1065c818f5eb23eb30" FOREIGN KEY ("classificationId") REFERENCES "classification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trading_group" ADD "description" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "ib_commission_profile" ADD CONSTRAINT "FK_5aed78e421dddada0e44fff568c" FOREIGN KEY ("classificationId") REFERENCES "classification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ib_commission_profile" ADD CONSTRAINT "FK_c34298c715de9a6624b44bf379b" FOREIGN KEY ("tradingGroupId") REFERENCES "trading_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ib_commission_profile" ADD CONSTRAINT "FK_933e85b5b134d46f4cd330b0212" FOREIGN KEY ("copyTradingGroupId") REFERENCES "trading_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ib_commission_profile" ADD CONSTRAINT "FK_5ce030c8019c57617908f4828fa" FOREIGN KEY ("agentTradingGroupId") REFERENCES "trading_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partner_links" ADD "commissionProfileId" int`);
        await queryRunner.query(`ALTER TABLE "partner_links" ADD "partnerTypeId" int NOT`);
        await queryRunner.query(`ALTER TABLE "partner_links" ADD "linkType" text NOT NULL CONSTRAINT "DF_a97125d99ad0f93d00d6e9c50de" DEFAULT 'Client'`);
        await queryRunner.query(`ALTER TABLE "partner_links" ADD "deletedAt" datetime2`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> { }

}
