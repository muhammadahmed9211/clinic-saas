import { MigrationInterface, QueryRunner } from 'typeorm';

export class OperatorTargets11726782149375 implements MigrationInterface {
  name = 'OperatorTargets11726782149375';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator_targets" ADD "created_at" datetime2 NOT NULL CONSTRAINT "DF_bfc6257681accd63641a5d6797d" DEFAULT getdate()`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator_targets" ADD "deleted_at" datetime2`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator_targets" ADD "updated_at" datetime2 NOT NULL CONSTRAINT "DF_edc0fd32aa75f7a9e49e7abb67b" DEFAULT getdate()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator_targets" DROP CONSTRAINT "DF_edc0fd32aa75f7a9e49e7abb67b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator_targets" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator_targets" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator_targets" DROP CONSTRAINT "DF_bfc6257681accd63641a5d6797d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator_targets" DROP COLUMN "created_at"`,
    );
  }
}
