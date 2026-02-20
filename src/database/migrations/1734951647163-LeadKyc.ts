import { MigrationInterface, QueryRunner } from "typeorm";

export class LeadKyc1734951647163 implements MigrationInterface {
    name = 'LeadKyc1734951647163'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "kycStatus"`);
        await queryRunner.query(`ALTER TABLE "lead" ADD "kycStatus" int`);
        await queryRunner.query(`ALTER TABLE "lead" ADD CONSTRAINT "FK_802c89538d021406771b2d2f69b" FOREIGN KEY ("kycStatus") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" DROP CONSTRAINT "FK_802c89538d021406771b2d2f69b"`);
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "kycStatus"`);
        await queryRunner.query(`ALTER TABLE "lead" ADD "kycStatus" nvarchar(255)`);
    }

}
