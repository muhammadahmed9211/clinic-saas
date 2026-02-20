import { MigrationInterface, QueryRunner } from "typeorm";

export class AditionalTablesRegulations1729086120959 implements MigrationInterface {
    name = 'AditionalTablesRegulations1729086120959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "regulations_countries" ("id" int NOT NULL IDENTITY(1,1), "countryCode" nvarchar(255) NOT NULL, CONSTRAINT "PK_6c2fa1fd828979494aef08dd375" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "regulation_translations" ("id" int NOT NULL IDENTITY(1,1), "fieldName" nvarchar(255), "languageCode" nvarchar(255), "translationText" nvarchar(255), "regulationId" int, CONSTRAINT "PK_d1b341b0825de15791f5e76f58c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "regulations" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "postalCode" nvarchar(255), "website" nvarchar(255), "contact" nvarchar(255), "logo" nvarchar(255), "subDomain" nvarchar(255), "domainExtension" ntext, "createdAt" datetime NOT NULL CONSTRAINT "DF_791d5c99aa413733da1ba31ee31" DEFAULT getdate(), "deletedAt" datetime2, "updatedAt" datetime NOT NULL CONSTRAINT "DF_df14a6d877472b646e352a391d7" DEFAULT getdate(), CONSTRAINT "PK_a16db742c6f0c1ef5a149be81fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "regulation_blocked_countries" ("id" int NOT NULL IDENTITY(1,1), "regulationId" int, "countryId" int, CONSTRAINT "PK_9836f55feb790afc0ab7b28d3e4" PRIMARY KEY ("id"))`);      
        await queryRunner.query(`ALTER TABLE "regulation_translations" ADD CONSTRAINT "FK_69676d90d7599bb88e033647d51" FOREIGN KEY ("regulationId") REFERENCES "regulations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "regulation_blocked_countries" ADD CONSTRAINT "FK_ee6464b96a2250bb35e5381b7db" FOREIGN KEY ("regulationId") REFERENCES "regulations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "regulation_blocked_countries" ADD CONSTRAINT "FK_293dc3b6520c3586714ab583e43" FOREIGN KEY ("countryId") REFERENCES "regulations_countries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "regulations" ADD "domainExtension" ntext`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "regulation_blocked_countries" DROP CONSTRAINT "FK_293dc3b6520c3586714ab583e43"`);
        await queryRunner.query(`ALTER TABLE "regulation_blocked_countries" DROP CONSTRAINT "FK_ee6464b96a2250bb35e5381b7db"`);
        await queryRunner.query(`ALTER TABLE "regulation_translations" DROP CONSTRAINT "FK_69676d90d7599bb88e033647d51"`);
        await queryRunner.query(`DROP TABLE "regulation_blocked_countries"`);
        await queryRunner.query(`DROP TABLE "regulations"`);
        await queryRunner.query(`DROP TABLE "regulation_translations"`);
        await queryRunner.query(`DROP TABLE "regulations_countries"`);
    }

}