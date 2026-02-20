import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdminKycTable1722245720308 implements MigrationInterface {
  name = 'AdminKycTable1722245720308';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "required_kyc_documents" ADD "isPartner" bit NOT NULL CONSTRAINT "DF_0c033de4a457a72528e087b886a" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "required_kyc_documents" DROP COLUMN "isPartner"`,
    );
  }
}
