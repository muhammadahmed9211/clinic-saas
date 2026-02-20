import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserKycDocumentDetail1711842928807 implements MigrationInterface {
  name = 'UserKycDocumentDetail1711842928807';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rejected_reason" ("id" int NOT NULL IDENTITY(1,1), "labelId" int NOT NULL, "name" nvarchar(255) NOT NULL, CONSTRAINT "PK_7c4e8ae75f4a21c13c18d7388cf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_kyc_document_detail" ("id" int NOT NULL IDENTITY(1,1), "type" nvarchar(255) NOT NULL, "firstName" nvarchar(255) NOT NULL, "lastName" nvarchar(255) NOT NULL, "classification" nvarchar(255) NOT NULL, "idNumber" nvarchar(255) NOT NULL, "nationality" nvarchar(255) NOT NULL, "dateOfBirth" date NOT NULL, "documentExpiryDate" date NOT NULL, "rejectedReasonIds" nvarchar(255), "created_at" datetime2 NOT NULL CONSTRAINT "DF_6697eeba4a55a922f42e99dea98" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_de878e8d568890eb6b07b649f00" DEFAULT getdate(), "deleted_at" datetime2, "userId" int, CONSTRAINT "PK_02a21bf478aa13d1bdc95a525b7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_document_detail" ADD CONSTRAINT "FK_cf327ad05d29c6489b43ef996d6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_kyc_document_detail" DROP CONSTRAINT "FK_cf327ad05d29c6489b43ef996d6"`,
    );
    await queryRunner.query(`DROP TABLE "user_kyc_document_detail"`);
    await queryRunner.query(`DROP TABLE "rejected_reason"`);
  }
}
