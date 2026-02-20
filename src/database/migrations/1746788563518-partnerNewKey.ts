import { MigrationInterface, QueryRunner } from "typeorm";

export class PartnerNewKey1746788563518 implements MigrationInterface {
    name = 'PartnerNewKey1746788563518'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner" ADD "mt5AccountId" int`);
        await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "userIbId"`);
        await queryRunner.query(`ALTER TABLE "partner" ADD "userIbId" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "partner" ADD CONSTRAINT "FK_1c6fd3b7ae24e67d817d9ee1043" FOREIGN KEY ("mt5AccountId") REFERENCES "mt5_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partner" ADD CONSTRAINT "FK_a47c54e1f4dd2fd43faed52a2a3" FOREIGN KEY ("partnerTypeId") REFERENCES "partner_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner" DROP CONSTRAINT "FK_a47c54e1f4dd2fd43faed52a2a3"`);
        await queryRunner.query(`ALTER TABLE "partner" DROP CONSTRAINT "FK_1c6fd3b7ae24e67d817d9ee1043"`);
        await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "userIbId"`);
        await queryRunner.query(`ALTER TABLE "partner" ADD "userIbId" int`);
        await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "mt5AccountId"`);
    }

}
