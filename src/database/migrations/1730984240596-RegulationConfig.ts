import { MigrationInterface, QueryRunner } from 'typeorm';

export class RegulationConfig1730984240596 implements MigrationInterface {
  name = 'RegulationConfig1730984240596';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "regulation_group" ("id" int NOT NULL IDENTITY(1,1), "key" nvarchar(255) NOT NULL, "title" nvarchar(255) NOT NULL, "description" nvarchar(255), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_cb1a84c0a36550244a1ad35d17e" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_8d4bcb79ca3cdf936d135c15e7c" DEFAULT getdate(), "regulationId" int, CONSTRAINT "PK_b850b0be6a139ea0841d4f15a60" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "regulation_config" ("id" int NOT NULL IDENTITY(1,1), "type" nvarchar(255), "key" nvarchar(255) NOT NULL, "label" nvarchar(255) NOT NULL, "value" nvarchar(255) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_12aab15a9b6e2bada48a50bb83a" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_751e85f97a36bf6ffe8fdc0a322" DEFAULT getdate(), "groupId" int, CONSTRAINT "PK_4538a34e727611dc307099ef6e9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulation_group" ADD CONSTRAINT "FK_568681a900bca0478c8dcd2f55d" FOREIGN KEY ("regulationId") REFERENCES "regulations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulation_config" ADD CONSTRAINT "FK_b6f1de290cf98abc40eeba76039" FOREIGN KEY ("groupId") REFERENCES "regulation_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "regulation_config" DROP CONSTRAINT "FK_b6f1de290cf98abc40eeba76039"`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulation_group" DROP CONSTRAINT "FK_568681a900bca0478c8dcd2f55d"`,
    );
    await queryRunner.query(`DROP TABLE "regulation_config"`);
    await queryRunner.query(`DROP TABLE "regulation_group"`);
  }
}
