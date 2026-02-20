import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedMt5AccountsTable1710316190058 implements MigrationInterface {
  name = 'AddedMt5AccountsTable1710316190058';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mt5_account" ("login" nvarchar(255) NOT NULL, "email" varchar(255) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_5006e337875c683ac31db982ab5" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_5cf6ec36275703001503c029780" DEFAULT getdate(), "serverId" uniqueidentifier, "userId" int, CONSTRAINT "PK_d81c82afe892f63f31893a0a2bf" PRIMARY KEY ("login"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" ADD CONSTRAINT "FK_67a76b7b6d10496434f903afa03" FOREIGN KEY ("serverId") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" ADD CONSTRAINT "FK_b819742f54d1dc287c06f201b5b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mt5_account" DROP CONSTRAINT "FK_b819742f54d1dc287c06f201b5b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mt5_account" DROP CONSTRAINT "FK_67a76b7b6d10496434f903afa03"`,
    );
    await queryRunner.query(`DROP TABLE "mt5_account"`);
  }
}
