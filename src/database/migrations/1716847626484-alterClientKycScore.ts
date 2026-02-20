import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterClientKycScore1716847626484 implements MigrationInterface {
  name = 'AlterClientKycScore1716847626484';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "kycScore"`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "kycScore" float CONSTRAINT "DF_0e26a67899ccb3f5d8ef23f649f" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "pendingInvestigation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "pendingInvestigation" bit CONSTRAINT "DF_c625e5399a6eaa5ef626c589d77" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_c625e5399a6eaa5ef626c589d77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "pendingInvestigation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "pendingInvestigation" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_0e26a67899ccb3f5d8ef23f649f"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "kycScore"`);
    await queryRunner.query(`ALTER TABLE "client" ADD "kycScore" int`);
  }
}
