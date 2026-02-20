import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterPartnerTradingGroups1717256656332
  implements MigrationInterface
{
  name = 'AlterPartnerTradingGroups1717256656332';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_trading_groups" ADD "kycDesk" int NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_trading_groups" DROP COLUMN "kycDesk"`,
    );
  }
}
