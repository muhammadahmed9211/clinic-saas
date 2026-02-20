/**
 * Add maxVolume and stepVolume columns to Symbol table
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 * Source: mt5-rest-api/src/database/migrations/1760639223523-addedMaxVolumeAndStepVolumeInSymbol.ts
 */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMaxAndStepVolumeToSymbol1729700000006
  implements MigrationInterface
{
  name = 'AddMaxAndStepVolumeToSymbol1729700000006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "symbol" ADD "maxVolume" int`);
    await queryRunner.query(`ALTER TABLE "symbol" ADD "stepVolume" int`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "symbol" DROP COLUMN "stepVolume"`);
    await queryRunner.query(`ALTER TABLE "symbol" DROP COLUMN "maxVolume"`);
  }
}

