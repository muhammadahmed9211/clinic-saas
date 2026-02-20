import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActiveLogsTypesCreate1713784099348 implements MigrationInterface {
  name = 'ActiveLogsTypesCreate1713784099348';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "active_log_type" ("id" int NOT NULL IDENTITY(1,1), "type" nvarchar(255) NOT NULL, "key" int NOT NULL, "value" nvarchar(255) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_4f7d98367a206e02a755891ecb0" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_24cabf6684f0ac7d9f982c47861" DEFAULT getdate(), CONSTRAINT "PK_efd90750a479064f748ebe7e3c8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1713784105634 FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1713784105769 FOR "dateTime"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_task" DROP CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "DF_91ca96ec6f2afef3d6557001f61" DEFAULT 1713261761376. FOR "dateTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" DROP CONSTRAINT "DF_67e240b054dcdf765c0277588ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crm_task" ADD CONSTRAINT "DF_67e240b054dcdf765c0277588ad" DEFAULT 1713261761161. FOR "dateTime"`,
    );
    await queryRunner.query(`DROP TABLE "active_log_type"`);
  }
}
