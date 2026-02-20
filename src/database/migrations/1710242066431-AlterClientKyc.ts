import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterClientKyc1710242066431 implements MigrationInterface {
  name = 'AlterClientKyc1710242066431';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "custom_status" DROP CONSTRAINT "CHK_0d4411d90c4fdd3ca8984903ac_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_status" ADD CONSTRAINT "CHK_0c74696e989fef36300bfdbdc9_ENUM" CHECK (type IN ('sales','retention','client_potential','audit_status','kyc_status'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_0e771fd0bea929332b43e56a404" FOREIGN KEY ("kycStatus") REFERENCES "custom_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_0e771fd0bea929332b43e56a404"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_status" ADD CONSTRAINT "CHK_0d4411d90c4fdd3ca8984903ac_ENUM" CHECK (type IN ('sales','retention','client_potential','audit_status'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_status" DROP CONSTRAINT "CHK_0c74696e989fef36300bfdbdc9_ENUM"`,
    );
  }
}
