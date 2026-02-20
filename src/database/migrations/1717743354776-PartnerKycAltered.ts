import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartnerKycAltered1717743354776 implements MigrationInterface {
  name = 'PartnerKycAltered1717743354776';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" ADD "creation_time" datetime2 NOT NULL CONSTRAINT "DF_d8cc04d93493e87184734d5254d" DEFAULT getdate()`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" ADD "modified_time" datetime2 NOT NULL CONSTRAINT "DF_01cb282bce0730629988c83bde8" DEFAULT getdate()`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" ADD "approval_time" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" ADD "approved_by" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" ADD "expiry_time" datetime`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" DROP COLUMN "expiry_time"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" DROP COLUMN "approved_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" DROP COLUMN "approval_time"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" DROP CONSTRAINT "DF_01cb282bce0730629988c83bde8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" DROP COLUMN "modified_time"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" DROP CONSTRAINT "DF_d8cc04d93493e87184734d5254d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" DROP COLUMN "creation_time"`,
    );
  }
}
