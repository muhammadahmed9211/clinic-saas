import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPSPPriorityTablesV21756377505174 implements MigrationInterface {
    name = 'AddedPSPPriorityTablesV21756377505174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "psp_countries_priority" ADD "configId" int`);
        await queryRunner.query(`CREATE TABLE "psp_countries_priority_config" ("id" int NOT NULL IDENTITY(1,1), "countryId" int NOT NULL, "userId" int NOT NULL, "priority" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_85d459148e539466fe9a8bd01c9" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_2d56793477d27de933e28885141" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_060ddbc96febd432075330c6496" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "psp_countries_priority" ADD CONSTRAINT "FK_ebd9894f2278a6d20d78011d0eb" FOREIGN KEY ("configId") REFERENCES "psp_countries_priority_config"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "psp_countries_priority_config" ADD CONSTRAINT "FK_fda1e64aadf93d219d63e187dd5" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "psp_countries_priority_config" ADD CONSTRAINT "FK_45262be1eb877d4d820cf45f8f8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "psp_countries_priority_config" DROP CONSTRAINT "FK_45262be1eb877d4d820cf45f8f8"`);
        await queryRunner.query(`ALTER TABLE "psp_countries_priority_config" DROP CONSTRAINT "FK_fda1e64aadf93d219d63e187dd5"`);
        await queryRunner.query(`ALTER TABLE "psp_countries_priority" DROP CONSTRAINT "FK_ebd9894f2278a6d20d78011d0eb"`);
        await queryRunner.query(`DROP TABLE "psp_countries_priority_config"`);
    }

}
