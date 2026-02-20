import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartnerUpgraded1718021284751 implements MigrationInterface {
  name = 'PartnerUpgraded1718021284751';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" DROP COLUMN "uploadedBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_document_detail" ALTER COLUMN "name" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_document_detail" DROP COLUMN "firstName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_document_detail" DROP COLUMN "lastName"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_document_detail" ALTER COLUMN "name" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" ADD "uploadedBy" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_document_detail" ADD "lastName" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_document_detail" ADD "firstName" nvarchar(255) NOT NULL`,
    );
  }
}
