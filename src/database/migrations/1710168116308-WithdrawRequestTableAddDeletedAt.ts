import { MigrationInterface, QueryRunner } from 'typeorm';

export class WithdrawRequestTableAddDeletedAt1710168116308
  implements MigrationInterface
{
  name = 'WithdrawRequestTableAddDeletedAt1710168116308';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" ADD "deletedAt" datetime2`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "withdraw_request" DROP COLUMN "deletedAt"`,
    );
  }
}
