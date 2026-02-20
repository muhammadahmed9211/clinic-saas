import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommissionProfileKeyFeatures1765525646616 implements MigrationInterface {
    name = 'AddCommissionProfileKeyFeatures1765525646616'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "commission_profile_key_feature" ("id" int NOT NULL IDENTITY(1,1), "feature" nvarchar(255), "createdAt" datetime NOT NULL CONSTRAINT "DF_1673673caf6eae0585ce752a59d" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_3da1db7cfee0736b3ce0aae6b88" DEFAULT getdate(), "deletedAt" datetime2, "commissionProfileId" int, CONSTRAINT "PK_9df017acb13c84241ff13a2e361" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "commission_profile_key_feature" ADD CONSTRAINT "FK_4e550b9abf77f4320dcdb355968" FOREIGN KEY ("commissionProfileId") REFERENCES "ib_commission_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
 }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commission_profile_key_feature" DROP CONSTRAINT "FK_4e550b9abf77f4320dcdb355968"`);
        await queryRunner.query(`DROP TABLE "commission_profile_key_feature"`);
        }

}
