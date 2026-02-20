import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateKycNotes1715011882566 implements MigrationInterface {
  name = 'UpdateKycNotes1715011882566';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notes" ("id" int NOT NULL IDENTITY(1,1), "file_id" uniqueidentifier, "note" nvarchar(max) NOT NULL, "type" nvarchar(255) NOT NULL, "isPublic" bit NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_def4674be2d6ae6b8496cb1c3e6" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_d5487b7bd312e650cd2676c22b0" DEFAULT getdate(), "deleted_at" datetime2, "user_id" int, "created_by" int, "user_kyc_document_id" int, CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_7708dcb62ff332f0eaf9f0743a7" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_b86c5f2b5de1e7a3d2a428cfb55" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_af5e3c614d6391f55a1ce67c4f3" FOREIGN KEY ("user_kyc_document_id") REFERENCES "user_kyc_documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_af5e3c614d6391f55a1ce67c4f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_b86c5f2b5de1e7a3d2a428cfb55"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_7708dcb62ff332f0eaf9f0743a7"`,
    );
    await queryRunner.query(`DROP TABLE "notes"`);
  }
}
