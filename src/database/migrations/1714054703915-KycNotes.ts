import { MigrationInterface, QueryRunner } from 'typeorm';

export class KycNotes1714054703915 implements MigrationInterface {
  name = 'KycNotes1714054703915';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "kyc_notes" ("id" int NOT NULL IDENTITY(1,1), "file_id" uniqueidentifier, "note" nvarchar(max) NOT NULL, "type" nvarchar(255) NOT NULL, "isPublic" bit NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_62f494d74fdc26da0e769781e9f" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_af4c8b44e480c8f92e736d97a65" DEFAULT getdate(), "deleted_at" datetime2, "user_id" int, "created_by" int, "user_kyc_document_id" int, CONSTRAINT "PK_fd9256132511bc4cb2d6ccc4b86" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_notes" ADD CONSTRAINT "FK_69b7eb63aa66097e4e8631ccfb4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_notes" ADD CONSTRAINT "FK_fe0f24a6024a50d5ae3895eb03c" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_notes" ADD CONSTRAINT "FK_db73b8fdaca0060a054784d02c7" FOREIGN KEY ("user_kyc_document_id") REFERENCES "user_kyc_documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "kyc_notes" DROP CONSTRAINT "FK_db73b8fdaca0060a054784d02c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_notes" DROP CONSTRAINT "FK_fe0f24a6024a50d5ae3895eb03c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_notes" DROP CONSTRAINT "FK_69b7eb63aa66097e4e8631ccfb4"`,
    );
    await queryRunner.query(`DROP TABLE "kyc_notes"`);
  }
}
