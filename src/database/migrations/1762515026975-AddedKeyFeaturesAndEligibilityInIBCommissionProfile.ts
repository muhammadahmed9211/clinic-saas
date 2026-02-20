import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedKeyFeaturesAndEligibilityInIBCommissionProfile1762515026975 implements MigrationInterface {
    name = 'AddedKeyFeaturesAndEligibilityInIBCommissionProfile1762515026975'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "classification_key_feature" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "value" nvarchar(255) NOT NULL, "description" nvarchar(255), "createdAt" datetime NOT NULL CONSTRAINT "DF_7e3c3fa3cd8db389b9f43e5dae7" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_dc9d418a555222ec43c6f87da6f" DEFAULT getdate(), "deletedAt" datetime2, "classificationId" int, CONSTRAINT "PK_7c517227d9a8175b086b35643f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "classification_eligibility" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "value" nvarchar(255) NOT NULL, "description" nvarchar(255), "createdAt" datetime NOT NULL CONSTRAINT "DF_fc2ae65e0e70d713860cc395c81" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_e6c25305ea042e81fc1bc3d7a32" DEFAULT getdate(), "deletedAt" datetime2, "classificationId" int, CONSTRAINT "PK_a4200e2f2f654bcc58fa864232e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "classification_key_feature" ADD CONSTRAINT "FK_c2a54f11c83c4fe35be1f671f57" FOREIGN KEY ("classificationId") REFERENCES "classification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classification_eligibility" ADD CONSTRAINT "FK_8fc5d955b571213e76c93433a7e" FOREIGN KEY ("classificationId") REFERENCES "classification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
