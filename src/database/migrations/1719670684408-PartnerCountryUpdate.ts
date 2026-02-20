import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartnerCountryUpdate1719670684408 implements MigrationInterface {
  name = 'PartnerCountryUpdate1719670684408';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "country"`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "country" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "country"`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "country" nvarchar(MAX)`,
    );
  }
}
