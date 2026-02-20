/**
 * Add contractSize and isTopMover columns to Symbol table
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 * Source: mt5-rest-api migration
 */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContractSizeAndIsTopMoverToSymbol1729700000001
  implements MigrationInterface
{
  name = 'AddContractSizeAndIsTopMoverToSymbol1729700000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "symbol" ADD "contractSize" int`);
    await queryRunner.query(
      `ALTER TABLE "symbol" ADD "isTopMover" bit NOT NULL CONSTRAINT "DF_symbol_isTopMover" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "symbol" DROP COLUMN "isTopMover"`);
    await queryRunner.query(`ALTER TABLE "symbol" DROP COLUMN "contractSize"`);
  }
}

