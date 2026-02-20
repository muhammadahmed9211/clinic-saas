import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIbConfig1735743620898 implements MigrationInterface {
  name = 'CreateIbConfig1735743620898';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ib_profile_config" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "priority" int NOT NULL, "profileType" nvarchar(255) NOT NULL, "entity" nvarchar(255), "distribution" nvarchar(255) NOT NULL, "setCashback" bit, "isDeductFromIb" bit, "cashbackAmountType" nvarchar(255), "cashbackAmount" nvarchar(255), "scalpingTrades" nvarchar(255), "symbols" nvarchar(255), "isActive" bit NOT NULL CONSTRAINT "DF_304059639eacdf542f5e32dc0f7" DEFAULT 1, "createdAt" datetime NOT NULL CONSTRAINT "DF_6fa9995443ab63f7e4e0cd6f10d" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_a4edb146aa65d8ee5a3cbacc78e" DEFAULT getdate(), "commissionProfileId" int, "createdById" int, CONSTRAINT "PK_cf4cf4bfc16c8b07ab2e85e1acb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "ib_profile_config" ADD CONSTRAINT "FK_8537e48eb702df1273e96ea3b3e" FOREIGN KEY ("commissionProfileId") REFERENCES "ib_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ib_profile_config" ADD CONSTRAINT "FK_f44cc759ca8fa51cd3e950e1dec" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ib_profile_config" DROP CONSTRAINT "FK_f44cc759ca8fa51cd3e950e1dec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ib_profile_config" DROP CONSTRAINT "FK_8537e48eb702df1273e96ea3b3e"`,
    );
    await queryRunner.query(`DROP TABLE "ib_profile_config"`);
  }
}
