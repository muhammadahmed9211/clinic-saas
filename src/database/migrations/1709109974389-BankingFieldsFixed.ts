import { MigrationInterface, QueryRunner } from 'typeorm';

export class BankingFieldsFixed1709109974389 implements MigrationInterface {
  name = 'BankingFieldsFixed1709109974389';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "bankAccount_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "bankAccount_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "bankBranch_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "bankAccountName" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "bankAccountNumber" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "bankBranchName" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "bankBranchName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "bankAccountNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "bankAccountName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "bankBranch_name" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "bankAccount_number" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "bankAccount_name" nvarchar(255)`,
    );
  }
}
