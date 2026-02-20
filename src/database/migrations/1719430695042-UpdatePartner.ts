import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePartner1719430695042 implements MigrationInterface {
  name = 'UpdatePartner1719430695042';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "registrationIp" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "partner" ADD "revSharePercent" int`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "managerOperatorId" int`,
    );
    await queryRunner.query(`ALTER TABLE "partner" ADD "isRecycleActive" bit`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "notes" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "source" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "totalCount" int`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "sourceOverride" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "partner" ADD "isPrivate" bit`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "externalAuthId" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "applicationStatus" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "customerSupport" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "marketingEmailsEnabled" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "partner" ADD "scheme" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "entity" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "platformIdGroup" int`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "membership" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "partner" ADD "isDeleted" bit`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "kycStatus" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "partner" ADD "isApproved" bit`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "externalId"`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "externalId" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "externalId"`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "externalId" int`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "isApproved"`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "kycStatus"`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "isDeleted"`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "membership"`);
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "platformIdGroup"`,
    );
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "entity"`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "scheme"`);
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "marketingEmailsEnabled"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "customerSupport"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "applicationStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "externalAuthId"`,
    );
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "isPrivate"`);
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "sourceOverride"`,
    );
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "totalCount"`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "source"`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "notes"`);
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "isRecycleActive"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "managerOperatorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "revSharePercent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "registrationIp"`,
    );
  }
}
