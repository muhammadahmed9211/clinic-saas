import { MigrationInterface, QueryRunner } from 'typeorm';

export class DataUploadTable1720175491837 implements MigrationInterface {
  name = 'DataUploadTable1720175491837';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "data_upload" ("id" int NOT NULL IDENTITY(1,1), "userId" int, "records" int, "uploadedRecords" int, "failure" int, "operator" nvarchar(255), "type" nvarchar(255), "status" nvarchar(255), "progress" int, "errors" nvarchar(255), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_4f3fffed01f814e1a2be90bc55d" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_67b06d6e75ed6b2559eb4842f6f" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_c7ee1b0bef5a70d4304f0a9d0ef" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "data_upload"`);
  }
}
