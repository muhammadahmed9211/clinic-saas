import { MigrationInterface, QueryRunner } from "typeorm";

export class CompanyBankCountryEnable1762939973080 implements MigrationInterface {
    name = 'CompanyBankCountryEnable1762939973080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bank_account_countries" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime NOT NULL CONSTRAINT "DF_7eca4afdaf3567ad400cae69701" DEFAULT getdate(), "deletedAt" datetime2, "updatedAt" datetime NOT NULL CONSTRAINT "DF_eb7e5854b86b807ce117ae7f2b8" DEFAULT getdate(), "bankAccountId" int NOT NULL, "countryId" int, CONSTRAINT "PK_6d45e944c0d3ef105a55a2d9100" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bank_account" ADD "isRegulationRestricted" bit NOT NULL CONSTRAINT "DF_1b09e936aeef639bed4cfd15608" DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE "bank_account" ADD "isCountryRestricted" bit NOT NULL CONSTRAINT "DF_342782e0b81aefe3e1177359d88" DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE "bank_account" ADD "regulationRestrictionType" nvarchar(255) NOT NULL CONSTRAINT "DF_c2e75cc7266ab69a77778619d1b" DEFAULT 'Include'`);
        await queryRunner.query(`ALTER TABLE "bank_account" ADD "countryRestrictionType" nvarchar(255) NOT NULL CONSTRAINT "DF_0172cfd0cad66c9eb72b8b88b84" DEFAULT 'Include'`);
        await queryRunner.query(`ALTER TABLE "bank_account_countries" ADD CONSTRAINT "FK_77be3f8dd630ae92474ca75288c" FOREIGN KEY ("bankAccountId") REFERENCES "bank_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank_account_countries" ADD CONSTRAINT "FK_d81244ba6ae10a83332bd102052" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
    }

}
