import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserComplianceColumns1726556482209 implements MigrationInterface {
  name = 'UserComplianceColumns1726556482209';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_compliance" ADD "createdAt" datetime2 NOT NULL CONSTRAINT "DF_4c296ef4682a7f65b3951319274" DEFAULT getdate()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_compliance" ADD "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_5653b2bda374889a68dacae8037" DEFAULT getdate()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_compliance" ADD "deletedAt" datetime2`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_compliance" DROP COLUMN "userComplianceData"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_compliance" ADD "userComplianceData" nvarchar(MAX)`,
    );
    // await queryRunner.query(`ALTER TABLE "communication" ADD CONSTRAINT "FK_045a80cba824af9448fe63c41ce" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_compliance" DROP COLUMN "userComplianceData"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_compliance" ADD "userComplianceData" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_compliance" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_compliance" DROP CONSTRAINT "DF_5653b2bda374889a68dacae8037"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_compliance" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_compliance" DROP CONSTRAINT "DF_4c296ef4682a7f65b3951319274"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_compliance" DROP COLUMN "createdAt"`,
    );
  }
}
