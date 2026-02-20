import { MigrationInterface, QueryRunner } from "typeorm";

export class PartnerProfileAssignment1746192037203 implements MigrationInterface {
    name = 'PartnerProfileAssignment1746192037203'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "partner" ADD "partnerLevel" int`);
        await queryRunner.query(`ALTER TABLE "partner" ADD "masterIbId" int`);
        await queryRunner.query(`ALTER TABLE "partner" ADD "ibPath" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "partner" ADD "commissionProfileId" int`);
        await queryRunner.query(`ALTER TABLE "partner" ADD CONSTRAINT "FK_d3d217b2aba366f27d0ebc39017" FOREIGN KEY ("commissionProfileId") REFERENCES "ib_commission_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner" DROP CONSTRAINT "FK_d3d217b2aba366f27d0ebc39017"`);
        await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "commissionProfileId"`);
        await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "ibPath"`);
        await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "masterIbId"`);
        await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "partnerLevel"`);
    }

}
