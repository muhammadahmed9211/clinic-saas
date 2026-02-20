import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserKycDocuments1707917120777 implements MigrationInterface {
  name = 'UserKycDocuments1707917120777';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_kyc_documents" ("id" int NOT NULL IDENTITY(1,1), "userId" int NOT NULL, "documentId" int NOT NULL, "fileId" uniqueidentifier NOT NULL, "field_id" nvarchar(255) NOT NULL, "state" nvarchar(255) CONSTRAINT CHK_b69656b4882e865dd5aee0adc9_ENUM CHECK(state IN ('pending','rejected','approved')) NOT NULL CONSTRAINT "DF_2f8c7d7346963553c3337038322" DEFAULT 'pending', "reasons" text, "created_at" datetime2 NOT NULL CONSTRAINT "DF_7ce83085fff562010b3409b39d4" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_488105d7a572c26c6db066acba8" DEFAULT getdate(), CONSTRAINT "PK_5a3c4cfe0b07e97017678da4446" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_kyc_documents"`);
  }
}
