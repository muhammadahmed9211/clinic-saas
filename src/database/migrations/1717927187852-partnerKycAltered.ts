import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartnerKycAltered1717927187852 implements MigrationInterface {
  name = 'PartnerKycAltered1717927187852';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" ADD CONSTRAINT "FK_38a5e9692c00d0e8fb3a584c081" FOREIGN KEY ("partnerId") REFERENCES "partner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" ADD CONSTRAINT "FK_b778b2ecf685fd7ae822a18da19" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" DROP CONSTRAINT "FK_b778b2ecf685fd7ae822a18da19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_kyc_documents" DROP CONSTRAINT "FK_38a5e9692c00d0e8fb3a584c081"`,
    );
  }
}
