import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartnerKycOperatorTableAltered1722350145792
  implements MigrationInterface
{
  name = 'PartnerKycOperatorTableAltered1722350145792';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" DROP CONSTRAINT "FK_bbf65b2a0cb9586aed20bb250ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" ALTER COLUMN "approvedById" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" ADD CONSTRAINT "FK_bbf65b2a0cb9586aed20bb250ef" FOREIGN KEY ("approvedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" DROP CONSTRAINT "FK_bbf65b2a0cb9586aed20bb250ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" DROP COLUMN "approvedById"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" ADD "approvedById" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" ADD CONSTRAINT "FK_bbf65b2a0cb9586aed20bb250ef" FOREIGN KEY ("approvedById") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
