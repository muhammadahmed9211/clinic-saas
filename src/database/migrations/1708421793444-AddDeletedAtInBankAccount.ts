import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletedAtInBankAccount1708421793444
  implements MigrationInterface
{
  name = 'AddDeletedAtInBankAccount1708421793444';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bank_account" ADD "deletedAt" datetime2`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bank_account" DROP COLUMN "deletedAt"`,
    );
  }
}
