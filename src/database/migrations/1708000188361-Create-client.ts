import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClient1708000188361 implements MigrationInterface {
  name = 'CreateClient1708000188361';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "client" ("userId" int NOT NULL IDENTITY(1,1), "firstName" nvarchar(255), "lastName" nvarchar(255), "groupString" nvarchar(255), "email" nvarchar(255) NOT NULL, "telephone" nvarchar(255) NOT NULL, "telephonePrefix" nvarchar(255) NOT NULL, "id2" nvarchar(255), "fullAddress" nvarchar(255), "poBox" nvarchar(255), "city" nvarchar(255), "state" nvarchar(255), "zip" nvarchar(255), "kycNote" nvarchar(255), "dateOfBirth" datetime, "telephoneValid" bit, "affid" nvarchar(255), "question2" nvarchar(max), "agreementData" nvarchar(max), "userSignature" nvarchar(255), "mobile" nvarchar(255), "questionAnswers" nvarchar(255), "isActive" bit, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_363a7099b6a83740f25e00b86d4" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_0fbc83a8a01372c24e2954ea27e" DEFAULT getdate(), "deletedAt" datetime2, "photoId" uniqueidentifier, "roleId" int, "statusId" int, CONSTRAINT "PK_ad3b4bf8dd18a1d467c5c0fc13a" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_df6fe8ddd0ae60bcae565e229e" ON "client" ("firstName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6436cc6b79593760b9ef921ef1" ON "client" ("email") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cc9302244509c0a0d012244d99" ON "client" ("id2") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_50ffba402a95d4a5948fd20135" ON "client" ("isActive") `,
    );
    await queryRunner.query(
      `ALTER TABLE "required_kyc_documents" DROP COLUMN "meta_data"`,
    );
    await queryRunner.query(
      `ALTER TABLE "required_kyc_documents" ADD "meta_data" nvarchar(max)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_26d6e7222cd259732fe8fa812d1" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_596dadf4ff5b01bd50869c57993" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_0ce939bf6640541190453d3693f" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_0ce939bf6640541190453d3693f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_596dadf4ff5b01bd50869c57993"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_26d6e7222cd259732fe8fa812d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "required_kyc_documents" DROP COLUMN "meta_data"`,
    );
    await queryRunner.query(
      `ALTER TABLE "required_kyc_documents" ADD "meta_data" nvarchar(4000)`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_50ffba402a95d4a5948fd20135" ON "client"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_cc9302244509c0a0d012244d99" ON "client"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_6436cc6b79593760b9ef921ef1" ON "client"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_df6fe8ddd0ae60bcae565e229e" ON "client"`,
    );
    await queryRunner.query(`DROP TABLE "client"`);
  }
}
