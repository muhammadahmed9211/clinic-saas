import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterOffice1716333672714 implements MigrationInterface {
  name = 'AlterOffice1716333672714';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "office" ADD "deletedAt" datetime2`);
    await queryRunner.query(
      `ALTER TABLE "office" ADD "system" bigint NOT NULL CONSTRAINT "DF_a8d1e12a0f0977ccc183427983a" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "office" DROP CONSTRAINT "DF_a8d1e12a0f0977ccc183427983a"`,
    );
    await queryRunner.query(`ALTER TABLE "office" DROP COLUMN "system"`);
    await queryRunner.query(`ALTER TABLE "office" DROP COLUMN "deletedAt"`);
  }
}
