import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedCopyTradingGroup1741688448694 implements MigrationInterface {
  name = 'AddedCopyTradingGroup1741688448694';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_trading_groups" ADD "copyTradingGroupSw" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_trading_groups" ALTER COLUMN "copyTradingGroup" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_trading_groups" ALTER COLUMN "copyTradingGroup" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_trading_groups" DROP COLUMN "copyTradingGroupSw"`,
    );
  }
}
