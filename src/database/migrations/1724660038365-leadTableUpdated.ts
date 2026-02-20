import { MigrationInterface, QueryRunner } from 'typeorm';

export class LeadTableUpdated1724660038365 implements MigrationInterface {
  name = 'LeadTableUpdated1724660038365';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lead" ADD "kycStatus" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "type" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "lead" ADD "industry" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "callOptOut" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "regulations" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "totalDeposits" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "totalDeposits"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "regulations"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "callOptOut"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "industry"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "type"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "kycStatus"`);
  }
}
