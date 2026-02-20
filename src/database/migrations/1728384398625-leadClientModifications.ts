import { MigrationInterface, QueryRunner } from 'typeorm';

export class LeadClientModifications1728384398625
  implements MigrationInterface
{
  name = 'LeadClientModifications1728384398625';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "retentionManagerId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "retentionManager" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "financeManagerId" int`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "financeManager" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "kycManagerId" int`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "kycManager" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "supportManagerId" int`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "supportManager" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "lead" ADD "retentionManagerId" int`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "retentionManager" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead" DROP COLUMN "retentionManager"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" DROP COLUMN "retentionManagerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "supportManager"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "supportManagerId"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "kycManager"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "kycManagerId"`);
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "financeManager"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "financeManagerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "retentionManager"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "retentionManagerId"`,
    );
  }
}
