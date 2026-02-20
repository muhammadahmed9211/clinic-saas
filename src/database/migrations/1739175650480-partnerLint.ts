import { MigrationInterface, QueryRunner } from "typeorm";

export class PartnerLint1739175650480 implements MigrationInterface {
    name = 'PartnerLint1739175650480'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "partner_links" ADD "utmSource" text`);
        await queryRunner.query(`ALTER TABLE "partner_links" ADD "source" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "partner_links" DROP COLUMN "source"`);
        await queryRunner.query(`ALTER TABLE "partner_links" DROP COLUMN "utmSource"`);
    }

}
