import { MigrationInterface, QueryRunner } from 'typeorm';

export class KycDetailUpdate1713270679820 implements MigrationInterface {
  name = 'KycDetailUpdate1713270679820';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_kyc_document_detail" ALTER COLUMN "classification" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_document_detail" ALTER COLUMN "idNumber" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_document_detail" ALTER COLUMN "nationality" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_document_detail" ALTER COLUMN "dateOfBirth" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_document_detail" ALTER COLUMN "documentExpiryDate" date`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_kyc_document_detail" ALTER COLUMN "documentExpiryDate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_document_detail" ALTER COLUMN "dateOfBirth" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_document_detail" ALTER COLUMN "nationality" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_document_detail" ALTER COLUMN "idNumber" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_document_detail" ALTER COLUMN "classification" nvarchar(255) NOT NULL`,
    );
  }
}
