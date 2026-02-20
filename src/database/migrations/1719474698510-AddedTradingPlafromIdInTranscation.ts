import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTradingPlafromIdInTranscation1719474698510
  implements MigrationInterface
{
  name = 'AddedTradingPlafromIdInTranscation1719474698510';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_8c48658c382b87c119b6a55a66e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "tradingPlatformId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "tradingPlatformId" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "tradingPlatformId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "tradingPlatformId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_8c48658c382b87c119b6a55a66e" FOREIGN KEY ("tradingPlatformId") REFERENCES "mt5_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
