import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedDefaultDashboardInRole1749123291172
  implements MigrationInterface
{
  name = 'AddedDefaultDashboardInRole1749123291172';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role" ADD "defaultDashboard" nvarchar(255) NOT NULL CONSTRAINT "DF_16ea97dd03aaf46b2d87569526c" DEFAULT 'General Dashboard'`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_status" DROP CONSTRAINT "CHK_bb94aecad4ab572bdbb0bb6e0b_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_status" ADD CONSTRAINT "CHK_b8e3f6dd2be83102f1fc8abcfa_ENUM" CHECK (type IN ('sales','retention','client_potential','audit_status','kyc_status','system','regulations','client_type','call_results','lead','report_activity','dashboard'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "DF_16ea97dd03aaf46b2d87569526c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" DROP COLUMN "defaultDashboard"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_status" ADD CONSTRAINT "CHK_bb94aecad4ab572bdbb0bb6e0b_ENUM" CHECK (type IN ('sales','retention','client_potential','audit_status','kyc_status','system','regulations','client_type','call_results','lead','report_activity'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_status" DROP CONSTRAINT "CHK_b8e3f6dd2be83102f1fc8abcfa_ENUM"`,
    );
  }
}
