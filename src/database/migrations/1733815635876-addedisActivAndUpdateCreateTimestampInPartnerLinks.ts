import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedisActivAndUpdateCreateTimestampInPartnerLinks1733815635876
  implements MigrationInterface
{
  name = 'AddedisActivAndUpdateCreateTimestampInPartnerLinks1733815635876';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_links" ADD "isActive" bit NOT NULL CONSTRAINT "DF_b699f3ba83f91126c3a6ad71925" DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_links" DROP COLUMN "creationTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_links" ADD "creationTime" datetime2 CONSTRAINT "DF_833391331138ff0710ddc8275e2" DEFAULT getdate()`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_links" DROP COLUMN "lastUpdateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_links" ADD "lastUpdateTime" datetime2 CONSTRAINT "DF_2e37dfad47601109a4179a2bfb0" DEFAULT getdate()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_links" DROP CONSTRAINT "DF_2e37dfad47601109a4179a2bfb0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_links" DROP COLUMN "lastUpdateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_links" ADD "lastUpdateTime" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_links" DROP CONSTRAINT "DF_833391331138ff0710ddc8275e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_links" DROP COLUMN "creationTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_links" ADD "creationTime" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_links" DROP CONSTRAINT "DF_b699f3ba83f91126c3a6ad71925"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_links" DROP COLUMN "isActive"`,
    );
  }
}
