import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartnerUpdates21716553158031 implements MigrationInterface {
  name = 'PartnerUpdates21716553158031';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner" ADD "externalId" int`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "maxPay" int`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "overPaid" int`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "approved" bit CONSTRAINT "DF_1289e75484c1db0d5c141c26105" DEFAULT 1`,
    );
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "referrerId"`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "referrerId" bigint`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "FK_768576e8316a862255a76517084" FOREIGN KEY ("referrerId") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "FK_768576e8316a862255a76517084"`,
    );
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "referrerId"`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "referrerId" int`);
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_1289e75484c1db0d5c141c26105"`,
    );
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "approved"`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "overPaid"`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "maxPay"`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "externalId"`);
  }
}
