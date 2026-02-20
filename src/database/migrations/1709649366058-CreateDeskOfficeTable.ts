import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDeskOfficeTable1709649366058 implements MigrationInterface {
  name = 'CreateDeskOfficeTable1709649366058';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "office" ("id" bigint NOT NULL IDENTITY(1,1), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_3bbcea3c26a83254340a4885d9f" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_20f2913831c8c3be6a21071632b" DEFAULT getdate(), "name" varchar(255) NOT NULL, "app_id" bigint NOT NULL CONSTRAINT "DF_c1a2a756320bc223fba8d1bc9c6" DEFAULT 0, CONSTRAINT "PK_200185316ba169fda17e3b6ba00" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "desk_type" ("uuid" uniqueidentifier NOT NULL CONSTRAINT "DF_08b4413003da21f551b51f36c7e" DEFAULT NEWSEQUENTIALID(), "id" int NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_6efa49865f6235f751100268234" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_bf39b10e67ee05b8a86f0609096" DEFAULT getdate(), "name" varchar(255) NOT NULL, CONSTRAINT "PK_08b4413003da21f551b51f36c7e" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "desk" ("id" bigint NOT NULL IDENTITY(1,1), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_9792ea475e2cc810049c77e22c0" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_78b3e5bcd584fca2cfbbb1dc074" DEFAULT getdate(), "name" varchar(255) NOT NULL, "type" int NOT NULL, "is_test" tinyint NOT NULL CONSTRAINT "DF_a6ef9589a6f91df21bcae320c6a" DEFAULT 0, "daily_goal" bigint NOT NULL CONSTRAINT "DF_d1857b238a2bafee6de504c6158" DEFAULT 0, "monthly_goal" bigint NOT NULL CONSTRAINT "DF_74969aa1f97b196da6fb61ca069" DEFAULT 0, "weekly_goal" bigint NOT NULL CONSTRAINT "DF_03acde24ae8a69d2161b2206b5d" DEFAULT 0, "office_id" bigint, "app_id" bigint NOT NULL CONSTRAINT "DF_401d49ef623193407bbd9e9ae55" DEFAULT 0, "is_active" tinyint NOT NULL CONSTRAINT "DF_2daf4eeebab3489e784edfdeefd" DEFAULT 1, CONSTRAINT "PK_e6f737f60f3b11ef487d158831d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "desk" ADD CONSTRAINT "FK_820e04a607b83af91d53eeffe79" FOREIGN KEY ("office_id") REFERENCES "office"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "desk" DROP CONSTRAINT "FK_820e04a607b83af91d53eeffe79"`,
    );
    await queryRunner.query(`DROP TABLE "desk"`);
    await queryRunner.query(`DROP TABLE "desk_type"`);
    await queryRunner.query(`DROP TABLE "office"`);
  }
}
