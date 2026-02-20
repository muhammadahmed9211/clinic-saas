import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterPartner1716671057284 implements MigrationInterface {
  name = 'AlterPartner1716671057284';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "country"`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "country" nvarchar(max)`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "blockedCountry"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "blockedCountry" nvarchar(max)`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "allowedCountry"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "allowedCountry" nvarchar(max)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "allowedCountry"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "allowedCountry" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "blockedCountry"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "blockedCountry" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "country"`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "country" nvarchar(255)`,
    );
  }
}
