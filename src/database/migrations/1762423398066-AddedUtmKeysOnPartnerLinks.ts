import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUtmKeysOnPartnerLinks1762423398066 implements MigrationInterface {
    name = 'AddedUtmKeysOnPartnerLinks1762423398066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner_links" ADD "utmMedium" text`);
        await queryRunner.query(`ALTER TABLE "partner_links" ADD "utmCampaign" text`);
        await queryRunner.query(`ALTER TABLE "partner_links" ADD "campaignId" text`);
        await queryRunner.query(`ALTER TABLE "partner_links" ADD "utmContent" text`);
        await queryRunner.query(`ALTER TABLE "partner_links" ADD "utmTerm" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
     
        await queryRunner.query(`ALTER TABLE "partner_links" DROP COLUMN "utmTerm"`);
        await queryRunner.query(`ALTER TABLE "partner_links" DROP COLUMN "utmContent"`);
        await queryRunner.query(`ALTER TABLE "partner_links" DROP COLUMN "campaignId"`);
        await queryRunner.query(`ALTER TABLE "partner_links" DROP COLUMN "utmCampaign"`);
        await queryRunner.query(`ALTER TABLE "partner_links" DROP COLUMN "utmMedium"`);
  }

}
