import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartnerUpdates31716559844128 implements MigrationInterface {
  name = 'PartnerUpdates31716559844128';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "countryId"`);
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "blockedCountriesId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "allowedCountriesId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "country" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "blockedCountry" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "allowedCountry" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "allowedCountry"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "blockedCountry"`,
    );
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "country"`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "allowedCountriesId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "blockedCountriesId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "countryId" int NOT NULL`,
    );
  }
}
