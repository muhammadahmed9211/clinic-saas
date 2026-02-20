import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartnerKycDocumentDetails1717758834532
  implements MigrationInterface
{
  name = 'PartnerKycDocumentDetails1717758834532';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "partner_kyc_document_detail" ("id" int NOT NULL IDENTITY(1,1), "type" nvarchar(255) NOT NULL, "firstName" nvarchar(255) NOT NULL, "lastName" nvarchar(255) NOT NULL, "classification" nvarchar(255), "idNumber" nvarchar(255), "nationality" nvarchar(255), "dateOfBirth" date, "documentExpiryDate" date, "rejectedReasonIds" nvarchar(255), "created_at" datetime2 NOT NULL CONSTRAINT "DF_bb94a3b6f671d5e60b4ae2d53cb" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_5dbfe235753fdc9a54d642a5676" DEFAULT getdate(), "deleted_at" datetime2, "partnerKYCDocumentId" int, CONSTRAINT "PK_816d662ec0d98e80536915774ee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_22d05935fe31881874b9f581d7" ON "partner_kyc_document_detail" ("partnerKYCDocumentId") WHERE "partnerKYCDocumentId" IS NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_document_detail" ADD CONSTRAINT "FK_22d05935fe31881874b9f581d76" FOREIGN KEY ("partnerKYCDocumentId") REFERENCES "partner_kyc_documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_document_detail" DROP CONSTRAINT "FK_22d05935fe31881874b9f581d76"`,
    );
    await queryRunner.query(
      `DROP INDEX "REL_22d05935fe31881874b9f581d7" ON "partner_kyc_document_detail"`,
    );
    await queryRunner.query(`DROP TABLE "partner_kyc_document_detail"`);
  }
}
