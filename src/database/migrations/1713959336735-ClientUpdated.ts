import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientUpdated1713959336735 implements MigrationInterface {
  name = 'ClientUpdated1713959336735';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "appRegistration" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "appsFlyerId" int`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "affiliate" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "affiliateLinkUrl" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "affiliateLinkId" int`);
    await queryRunner.query(`ALTER TABLE "client" ADD "ip" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "tracking" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "source" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "client" ADD "clickId" int`);
    await queryRunner.query(`ALTER TABLE "client" ADD "creationTime" datetime`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "pendingInvestigation" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "kycWorkflowStatus" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "clientStatus" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "clientStatus"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "kycWorkflowStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "pendingInvestigation"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "creationTime"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "clickId"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "source"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "tracking"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "ip"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "affiliateLinkId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "affiliateLinkUrl"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "affiliate"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "appsFlyerId"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "appRegistration"`,
    );
  }
}
