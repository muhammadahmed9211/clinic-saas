import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedDeviceInfoTable1763127146576 implements MigrationInterface {
  name = 'AddedDeviceInfoTable1763127146576';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "device_info" ("id" int NOT NULL IDENTITY(1,1), "deviceId" varchar(255) NOT NULL, "deviceType" varchar(100) NOT NULL, "name" varchar(255) NOT NULL, "model" varchar(255) NOT NULL, "manufacturer" varchar(50), "brand" varchar(50), "os" varchar(20) NOT NULL, "osVersion" varchar(100) NOT NULL, "appVersion" varchar(50) NOT NULL, "fcmToken" varchar(200), "previousUsers" text, "ipAddress" varchar(45), "location" varchar(100), "timezone" varchar(100), "disableNotifications" bit NOT NULL CONSTRAINT "DF_3c83b368c65f5330b16f3a55bb0" DEFAULT 0, "isActive" bit NOT NULL CONSTRAINT "DF_d5e02f0f37e102d3033aa97676a" DEFAULT 1, "createdAt" datetime NOT NULL CONSTRAINT "DF_003d76c6ae7de261a27858edce1" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_2a7033d3553994da236642ff428" DEFAULT getdate(), "deletedAt" datetime, "userId" int, CONSTRAINT "UQ_2aa6e18dbb3bd8bd71cee735c35" UNIQUE ("deviceId"), CONSTRAINT "PK_b1c15a80b0a4e5f4eebadbdd92c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f627b49a65e0597770451fa5ef" ON "device_info" ("deviceType") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_755fdb49d205b28b2e60fcaad1" ON "device_info" ("fcmToken") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f93494a957eb9b931d4c70c2b5" ON "device_info" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2342ab20f0661874aca4137eac" ON "device_info" ("ipAddress") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3c83b368c65f5330b16f3a55bb" ON "device_info" ("disableNotifications") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d5e02f0f37e102d3033aa97676" ON "device_info" ("isActive") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_003d76c6ae7de261a27858edce" ON "device_info" ("createdAt") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_2aa6e18dbb3bd8bd71cee735c3" ON "device_info" ("deviceId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "device_info" ADD CONSTRAINT "FK_f93494a957eb9b931d4c70c2b58" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device_info" DROP CONSTRAINT "FK_f93494a957eb9b931d4c70c2b58"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_2aa6e18dbb3bd8bd71cee735c3" ON "device_info"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_003d76c6ae7de261a27858edce" ON "device_info"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_d5e02f0f37e102d3033aa97676" ON "device_info"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_3c83b368c65f5330b16f3a55bb" ON "device_info"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_2342ab20f0661874aca4137eac" ON "device_info"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_f93494a957eb9b931d4c70c2b5" ON "device_info"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_755fdb49d205b28b2e60fcaad1" ON "device_info"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_f627b49a65e0597770451fa5ef" ON "device_info"`,
    );
    await queryRunner.query(`DROP TABLE "device_info"`);
  }
}
