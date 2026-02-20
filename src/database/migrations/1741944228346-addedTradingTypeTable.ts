import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTradingTypeTable1741944228346 implements MigrationInterface {
  name = 'AddedTradingTypeTable1741944228346';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mt5_account_trading_type" ("id" int NOT NULL IDENTITY(1,1), "key" nvarchar(255) NOT NULL, "name" nvarchar(255) NOT NULL, "isActive" bit NOT NULL CONSTRAINT "DF_dc884816bfe40fff15010fb7c23" DEFAULT 1, "createdAt" datetime NOT NULL CONSTRAINT "DF_45233229f422dc9dfd937650371" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_c83bbafec0f1913813512e099b3" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "UQ_2c1104b9b046109698abd7d77e3" UNIQUE ("key"), CONSTRAINT "PK_34d268e7f9d44d763f1d614d5ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" ADD "tradingTypeId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" ADD CONSTRAINT "FK_0b4610bdfae27a1054398db1912" FOREIGN KEY ("tradingTypeId") REFERENCES "mt5_account_trading_type"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mt5_account" DROP CONSTRAINT "FK_0b4610bdfae27a1054398db1912"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" DROP COLUMN "tradingTypeId"`,
    );
    await queryRunner.query(`DROP TABLE "mt5_account_trading_type"`);
  }
}
