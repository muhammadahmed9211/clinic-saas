import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartnerHashUpdate1716816410775 implements MigrationInterface {
  name = 'PartnerHashUpdate1716816410775';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner" ADD "editAffiliateRL" bit`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "editAffiliateRLInterval" bit`,
    );
    await queryRunner.query(`ALTER TABLE "partner" ADD "getAffiliateRL" bit`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "getAffiliateRLInterval" bit`,
    );
    await queryRunner.query(`ALTER TABLE "partner" ADD "hash" nvarchar(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "hash"`);
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "getAffiliateRLInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "getAffiliateRL"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "editAffiliateRLInterval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "editAffiliateRL"`,
    );
  }
}
