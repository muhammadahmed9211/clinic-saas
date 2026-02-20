import { MigrationInterface, QueryRunner } from "typeorm";

export class AddParamsInPartnnerLinks1761205536531 implements MigrationInterface {
    name = 'AddParamsInPartnnerLinks1761205536531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner_links" ADD "p1" text`);
        await queryRunner.query(`ALTER TABLE "partner_links" ADD "p2" text`);
        await queryRunner.query(`ALTER TABLE "partner_links" ADD "p3" text`);
        await queryRunner.query(`ALTER TABLE "partner_links" ADD "p4" text`);
        await queryRunner.query(`ALTER TABLE "partner_links" ADD "p5" text`);
        await queryRunner.query(`ALTER TABLE "partner_links" ADD "p6" text`);
      }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner_links" DROP COLUMN "p6"`);
        await queryRunner.query(`ALTER TABLE "partner_links" DROP COLUMN "p5"`);
        await queryRunner.query(`ALTER TABLE "partner_links" DROP COLUMN "p4"`);
        await queryRunner.query(`ALTER TABLE "partner_links" DROP COLUMN "p3"`);
        await queryRunner.query(`ALTER TABLE "partner_links" DROP COLUMN "p2"`);
        await queryRunner.query(`ALTER TABLE "partner_links" DROP COLUMN "p1"`);
       }

}
