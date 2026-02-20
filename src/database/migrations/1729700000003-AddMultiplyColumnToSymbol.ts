/**
 * Add multiply column to Symbol table
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 * Source: mt5-rest-api/src/database/migrations/1749643205053-addedMultiplyColumnInSymbolTable.ts
 */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMultiplyColumnToSymbol1729700000003
  implements MigrationInterface
{
  name = 'AddMultiplyColumnToSymbol1729700000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "symbol" ADD "multiply" int`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "symbol" DROP COLUMN "multiply"`);
  }
}

