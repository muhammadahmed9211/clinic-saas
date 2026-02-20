import { MigrationInterface, QueryRunner } from "typeorm";

export class Contactus1748854247353 implements MigrationInterface {
    name = 'Contactus1748854247353'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contact_us" ("id" int NOT NULL IDENTITY(1,1), "from" nvarchar(255) NOT NULL, "to" nvarchar(255) NOT NULL, "text" nvarchar(max) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_30138902df43cdee40d914dd424" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_c97b9be61b707e137984dd9c4a9" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_fa5b05489cc4361f727da7f9330" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "contact_us"`);
    }

}
