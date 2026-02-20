import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionMethodSyncWithTranscation1711626640536
  implements MigrationInterface
{
  name = 'TransactionMethodSyncWithTranscation1711626640536';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction_method" ("id" int NOT NULL IDENTITY(1,1), "method" nvarchar(255) NOT NULL, "isActive" bit NOT NULL CONSTRAINT "DF_f8f9b84485c503d4b4ce72bc03e" DEFAULT 1, "createdAt" datetime NOT NULL CONSTRAINT "DF_445f01b12a825a5f306d2cb9f22" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_fb742899fddcf7f4bb8b5709f12" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_46299cdd290767885705d0645a0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT CHK_fb681d0e65b6a891b2158a218c_ENUM`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "method"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "method" nvarchar(255) CONSTRAINT CHK_fb681d0e65b6a891b2158a218c_ENUM CHECK(method IN ('CREDIT_CARD','WIRE','MIGRATION','INTERNAL_TRANSFER','EXTERNAL_EXCHANGE','NONE','CRYPTO')) NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "transaction_method"`);
  }
}
