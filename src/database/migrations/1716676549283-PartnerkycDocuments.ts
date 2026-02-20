import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartnerkycDocuments1716676549283 implements MigrationInterface {
  name = 'PartnerkycDocuments1716676549283';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "partner_kyc_documents" ("id" int NOT NULL IDENTITY(1,1), "type" nvarchar(255), "status" nvarchar(255) CONSTRAINT CHK_73f3a68a2a987f2e50da0784fc_ENUM CHECK(status IN ('active','inactive')) NOT NULL CONSTRAINT "DF_0b00c596532325b34d6481b3dd3" DEFAULT 'active', "titile" nvarchar(255), "userKycNote" nvarchar(255), "uploadedBy" int, "documentId" int, "fileId" uniqueidentifier, "field_id" nvarchar(255), "side" varchar(10) CONSTRAINT CHK_e110b654b2d6de5ed94fe4065a_ENUM CHECK(side IN ('front','back')), "state" nvarchar(255) CONSTRAINT CHK_2b88fd4a7c41e022221e1e3b81_ENUM CHECK(state IN ('pending','rejected','approved')) NOT NULL CONSTRAINT "DF_2118d4013f31e7d6e595f58921a" DEFAULT 'pending', "kycStatus" int, "rejectionReasons" text, "rejectionReasonsText" text, "translationStatus" text, "translationRep" text, "created_at" datetime2 NOT NULL CONSTRAINT "DF_e4b700af510de8dbeacdc45f9e5" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_e65bc2b5f376a83a368f0180460" DEFAULT getdate(), "deleted_at" datetime2, "hidden" bit CONSTRAINT "DF_75beb9bbfa7c84d81478c533b97" DEFAULT 0, "approvedById" bigint, CONSTRAINT "PK_226d3f27e594edd5c416c0aea1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD "partner_kyc_document_id" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_0de1531bfa216ab1748008ca1c0" FOREIGN KEY ("partner_kyc_document_id") REFERENCES "partner_kyc_documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" ADD CONSTRAINT "FK_7cce2829dfde4a68cc21da94b3c" FOREIGN KEY ("kycStatus") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" ADD CONSTRAINT "FK_bbf65b2a0cb9586aed20bb250ef" FOREIGN KEY ("approvedById") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" DROP CONSTRAINT "FK_bbf65b2a0cb9586aed20bb250ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" DROP CONSTRAINT "FK_7cce2829dfde4a68cc21da94b3c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_0de1531bfa216ab1748008ca1c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP COLUMN "partner_kyc_document_id"`,
    );
    await queryRunner.query(`DROP TABLE "partner_kyc_documents"`);
  }
}
