import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableCallLogs1717505362096 implements MigrationInterface {
  name = 'CreateTableCallLogs1717505362096';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "call_log" ("id" int NOT NULL IDENTITY(1,1), "description" varchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_389b85eb33d6c4da0119d5aaff6" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_7776d48b5a597069fe425083820" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_13cb45e93264db6cbe9f0475592" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "call_log"`);
  }
}
