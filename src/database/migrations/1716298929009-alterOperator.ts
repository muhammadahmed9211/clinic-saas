import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterOperator1716298929009 implements MigrationInterface {
  name = 'AlterOperator1716298929009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "custom_status" DROP CONSTRAINT "CHK_0c74696e989fef36300bfdbdc9_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_status" ADD CONSTRAINT "CHK_b7f0b79f277884045de6a024ab_ENUM" CHECK (type IN ('sales','retention','client_potential','audit_status','kyc_status','system'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "custom_status" ADD CONSTRAINT "CHK_0c74696e989fef36300bfdbdc9_ENUM" CHECK (type IN ('sales','retention','client_potential','audit_status','kyc_status'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_status" DROP CONSTRAINT "CHK_b7f0b79f277884045de6a024ab_ENUM"`,
    );
  }
}
