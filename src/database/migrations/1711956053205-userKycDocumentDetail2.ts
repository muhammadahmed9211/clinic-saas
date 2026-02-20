import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserKycDocumentDetail21711956053205 implements MigrationInterface {
  name = 'UserKycDocumentDetail21711956053205';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_kyc_document_detail" ADD "userKYCDocumentId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_document_detail" ADD CONSTRAINT "FK_8703baea0c1c468d08885cc1b71" FOREIGN KEY ("userKYCDocumentId") REFERENCES "user_kyc_documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_document_detail" DROP CONSTRAINT "FK_cf327ad05d29c6489b43ef996d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_document_detail" DROP COLUMN "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" ADD "approvedBy" int`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_8703baea0c1c468d08885cc1b7" ON "user_kyc_document_detail" ("userKYCDocumentId") WHERE "userKYCDocumentId" IS NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "REL_8703baea0c1c468d08885cc1b7" ON "user_kyc_document_detail"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" DROP COLUMN "approvedBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_document_detail" ADD "userId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_document_detail" ADD CONSTRAINT "FK_cf327ad05d29c6489b43ef996d6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_document_detail" DROP CONSTRAINT "FK_8703baea0c1c468d08885cc1b71"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_document_detail" DROP COLUMN "userKYCDocumentId"`,
    );
  }
}
