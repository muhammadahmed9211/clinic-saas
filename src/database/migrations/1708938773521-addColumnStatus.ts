import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnStatus1708938773521 implements MigrationInterface {
  name = 'AddColumnStatus1708938773521';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" ADD "status" nvarchar(255) CONSTRAINT CHK_c86a6eae99b65a5a955b3e64eb_ENUM CHECK(status IN ('active','inactive')) NOT NULL CONSTRAINT "DF_e0120f19864713628c2f3065fa9" DEFAULT 'active'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" DROP CONSTRAINT "DF_e0120f19864713628c2f3065fa9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" DROP COLUMN "status"`,
    );
  }
}
