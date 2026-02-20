import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUserKycDocuments1711412547185 implements MigrationInterface {
  name = 'AlterUserKycDocuments1711412547185';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" ADD "kycNote" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" ADD "kycStatus" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" ADD CONSTRAINT "FK_b9e8d27d5eeaa6a7c0013d26040" FOREIGN KEY ("kycStatus") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" DROP CONSTRAINT "FK_b9e8d27d5eeaa6a7c0013d26040"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" DROP COLUMN "kycStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_kyc_documents" DROP COLUMN "kycNote"`,
    );
  }
}
