import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustomStatus1709559362340 implements MigrationInterface {
  name = 'CustomStatus1709559362340';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "custom_status" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "type" nvarchar(255) CONSTRAINT CHK_809dbdb342d7f734342f3bf64f_ENUM CHECK(type IN ('sales','retention')) NOT NULL, "sort" int NOT NULL, "is_hidden" bit NOT NULL CONSTRAINT "DF_da41ac8b11366128fa203478163" DEFAULT 0, "created_at" datetime2 NOT NULL CONSTRAINT "DF_e70b6cb03d8e018999be0133e8c" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_6c83f4428d8a2605709647d7929" DEFAULT getdate(), CONSTRAINT "PK_e4f79c09029aaebac63adeeaf53" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_ee77d0dd324463bf84b951ff4a" ON "client" ("internalSalesStatus") WHERE "internalSalesStatus" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_8d34c5f89d637582108be9a3a0" ON "client" ("internalRetentionStatus") WHERE "internalRetentionStatus" IS NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_ee77d0dd324463bf84b951ff4af" FOREIGN KEY ("internalSalesStatus") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_8d34c5f89d637582108be9a3a05" FOREIGN KEY ("internalRetentionStatus") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_8d34c5f89d637582108be9a3a05"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_ee77d0dd324463bf84b951ff4af"`,
    );
    await queryRunner.query(
      `DROP INDEX "REL_8d34c5f89d637582108be9a3a0" ON "client"`,
    );
    await queryRunner.query(
      `DROP INDEX "REL_ee77d0dd324463bf84b951ff4a" ON "client"`,
    );
    await queryRunner.query(`DROP TABLE "custom_status"`);
  }
}
