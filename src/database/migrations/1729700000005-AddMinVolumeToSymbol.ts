/**
 * Add minVolume column to Symbol table
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 * Source: mt5-rest-api/src/database/migrations/1758270649137-addedMinVolumeToSymbol.ts
 */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMinVolumeToSymbol1729700000005 implements MigrationInterface {
  name = 'AddMinVolumeToSymbol1729700000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "symbol" ADD "minVolume" int`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "symbol" DROP COLUMN "minVolume"`);
  }
}

