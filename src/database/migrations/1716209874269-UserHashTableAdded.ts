import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserHashTableAdded1716209874269 implements MigrationInterface {
  name = 'UserHashTableAdded1716209874269';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reset_password" ("id" int NOT NULL IDENTITY(1,1), "hash" nvarchar(255) NOT NULL, "expireAt" datetime2, "createdAt" datetime NOT NULL CONSTRAINT "DF_b135fd0f321a3bbf9462cd0cd32" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_7c096f256de15fe9633038ca582" DEFAULT getdate(), "deletedAt" datetime2, "userId" int NOT NULL, CONSTRAINT "PK_61c8fd0e31096e2046a82d0b8ee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "reset_password" ADD CONSTRAINT "FK_20b304cde809f95a03deb52a895" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reset_password" ADD "status" bit NOT NULL CONSTRAINT "DF_5527e40e455ce426defaa89e8a5" DEFAULT 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reset_password" DROP CONSTRAINT "FK_20b304cde809f95a03deb52a895"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reset_password" DROP COLUMN "status"`,
    );
    await queryRunner.query(`DROP TABLE "reset_password"`);
  }
}
