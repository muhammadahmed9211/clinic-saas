import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdminKyc1706621302108 implements MigrationInterface {
  name = 'AdminKyc1706621302108';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "required_kyc_documents" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "description" nvarchar(255), "meta_data" nvarchar(4000), "created_at" datetime2 NOT NULL CONSTRAINT "DF_d4e5882d9a5af69bacc1179d7d3" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_5f0c3e4defb66e2728ea0b77fce" DEFAULT getdate(), "deleted_at" datetime2, CONSTRAINT "PK_589ff176fae4f45de2d8c877c29" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "required_kyc_documents"`);
  }
}
