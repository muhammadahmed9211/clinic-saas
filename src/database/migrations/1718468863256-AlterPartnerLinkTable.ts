import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterPartnerLinkTable1718468863256 implements MigrationInterface {
  name = 'AlterPartnerLinkTable1718468863256';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_links" ADD "downloadAssets" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_links" ADD "redirectUrl" text`,
    );
    await queryRunner.query(`ALTER TABLE "partner_links" ADD "systemId" int`);
    await queryRunner.query(`ALTER TABLE "partner_links" ADD "order" text`);
    await queryRunner.query(
      `ALTER TABLE "partner_links" ADD "isInUrlForbidden" bit`,
    );
    await queryRunner.query(`ALTER TABLE "partner_links" ADD "kill" bit`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner_links" DROP COLUMN "kill"`);
    await queryRunner.query(
      `ALTER TABLE "partner_links" DROP COLUMN "isInUrlForbidden"`,
    );
    await queryRunner.query(`ALTER TABLE "partner_links" DROP COLUMN "order"`);
    await queryRunner.query(
      `ALTER TABLE "partner_links" DROP COLUMN "systemId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_links" DROP COLUMN "redirectUrl"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_links" DROP COLUMN "downloadAssets"`,
    );
  }
}
