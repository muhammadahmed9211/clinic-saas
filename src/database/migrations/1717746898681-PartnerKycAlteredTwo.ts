import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartnerKycAlteredTwo1717746898681 implements MigrationInterface {
  name = 'PartnerKycAlteredTwo1717746898681';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" DROP COLUMN "note"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" ADD "note" text`,
    );
  }
}
