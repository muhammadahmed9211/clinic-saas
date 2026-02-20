import { MigrationInterface, QueryRunner } from 'typeorm';

export class Communication1709209872200 implements MigrationInterface {
  name = 'Communication1709209872200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "communication" ("id" int NOT NULL IDENTITY(1,1), "text" text NOT NULL, "type" nvarchar(255) CONSTRAINT CHK_bf8d66774c0bc608a3c2ff8723_ENUM CHECK(type IN ('email','sms','whatsapp')) NOT NULL, "user_id" int NOT NULL, "operator_id" int NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_bc0c837110a416e48e7e0b2bf20" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_d1b86224742f915138a866a5a56" DEFAULT getdate(), "status" nvarchar(255) NOT NULL CONSTRAINT "DF_0901c57c6be21d1456e5213baaf" DEFAULT 'active', "starred" bit NOT NULL CONSTRAINT "DF_1fb21154093f0ad045bc9ca07f3" DEFAULT 0, CONSTRAINT "PK_392407b9e9100bee1a64e26cd5d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication" ADD CONSTRAINT "FK_3120e867d4bf41caa7b8984440e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication" ADD CONSTRAINT "FK_76ebbc2739cacf67e90e96c21fd" FOREIGN KEY ("operator_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "communication" DROP CONSTRAINT "FK_76ebbc2739cacf67e90e96c21fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communication" DROP CONSTRAINT "FK_3120e867d4bf41caa7b8984440e"`,
    );
    await queryRunner.query(`DROP TABLE "communication"`);
  }
}
