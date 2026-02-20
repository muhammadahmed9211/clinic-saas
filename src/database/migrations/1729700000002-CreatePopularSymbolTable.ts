/**
 * Create popular_symbol table
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 * Source: mt5-rest-api/src/database/migrations/1746691436129-mt5popular_symbol.ts
 */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePopularSymbolTable1729700000002
  implements MigrationInterface
{
  name = 'CreatePopularSymbolTable1729700000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "popular_symbol" (
                "id" int NOT NULL IDENTITY(1,1),
                "symbolId" int NOT NULL,
                "popularSince" datetime2 NOT NULL CONSTRAINT "DF_popular_symbol_popularSince" DEFAULT GETDATE(),
                "isActive" bit NOT NULL CONSTRAINT "DF_popular_symbol_isActive" DEFAULT 1,
                "createdAt" datetime NOT NULL CONSTRAINT "DF_popular_symbol_createdAt" DEFAULT getdate(),
                "updatedAt" datetime NOT NULL CONSTRAINT "DF_popular_symbol_updatedAt" DEFAULT getdate(),
                "deletedAt" datetime2,
                "lastActiveAt" datetime2 NOT NULL CONSTRAINT "DF_popular_symbol_lastActiveAt" DEFAULT GETDATE(),
                CONSTRAINT "PK_popular_symbol_id" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_popular_symbol_symbolId" UNIQUE ("symbolId"),
                CONSTRAINT "FK_popular_symbol_symbolId" FOREIGN KEY ("symbolId") REFERENCES "symbol"("id") ON DELETE CASCADE
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "popular_symbol"`);
  }
}

