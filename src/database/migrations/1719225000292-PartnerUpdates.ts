import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartnerUpdates1719225000292 implements MigrationInterface {
  name = 'PartnerUpdates1719225000292';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner" ADD "apiKey" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "partner_links" DROP COLUMN "brokerIds"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_links" ADD "brokerIds" nvarchar(max)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_links" DROP COLUMN "brokerIds"`,
    );
    await queryRunner.query(`ALTER TABLE "partner_links" ADD "brokerIds" int`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "apiKey"`);
  }
}
