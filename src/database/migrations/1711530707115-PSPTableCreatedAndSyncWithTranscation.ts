import { MigrationInterface, QueryRunner } from 'typeorm';

export class PSPTableCreatedAndSyncWithTranscation1711530707115
  implements MigrationInterface
{
  name = 'PSPTableCreatedAndSyncWithTranscation1711530707115';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "psp" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "displayName" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, "isActive" bit NOT NULL CONSTRAINT "DF_d09c329326cf3cf6036a667ab34" DEFAULT 1, "createdAt" datetime NOT NULL CONSTRAINT "DF_7635ddf7eec629f31e1a61cb468" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_570e196e58d0730aa8a00902079" DEFAULT getdate(), "deletedAt" datetime2, CONSTRAINT "PK_29b353a6d5fafdfae7ee082eb31" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "psp"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "pspId"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "pspId" int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_dde178b801b5d058914e6c4ba43" FOREIGN KEY ("pspId") REFERENCES "psp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_dde178b801b5d058914e6c4ba43"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "pspId"`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "pspId" bigint`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "psp" varchar(15)`);
    await queryRunner.query(`DROP TABLE "psp"`);
  }
}
