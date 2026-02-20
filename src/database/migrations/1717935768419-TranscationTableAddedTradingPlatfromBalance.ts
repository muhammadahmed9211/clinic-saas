import { MigrationInterface, QueryRunner } from 'typeorm';

export class TranscationTableAddedTradingPlatfromBalance1717935768419
  implements MigrationInterface
{
  name = 'TranscationTableAddedTradingPlatfromBalance1717935768419';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "tradingPlatformBalance" float`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "tradingPlatformBalance"`,
    );
  }
}
