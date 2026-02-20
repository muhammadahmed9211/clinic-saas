/**
 * Add opening price columns to Symbol table
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 * Source: mt5-rest-api/src/database/migrations/1755768701393-addedOpeningPriceToSymbol.ts
 */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOpeningPriceToSymbol1729700000004
  implements MigrationInterface
{
  name = 'AddOpeningPriceToSymbol1729700000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "symbol" ADD "openingPrice" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "symbol" ADD "openingPriceUpdatedAt" datetime2`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "symbol" DROP COLUMN "openingPriceUpdatedAt"`);
    await queryRunner.query(`ALTER TABLE "symbol" DROP COLUMN "openingPrice"`);
  }
}

