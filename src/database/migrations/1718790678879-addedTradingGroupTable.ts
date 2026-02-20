import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTradingGroupTable1718790678879 implements MigrationInterface {
  name = 'AddedTradingGroupTable1718790678879';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "trading_group" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "active" bit NOT NULL CONSTRAINT "DF_b6b3001a078311e931b27e676df" DEFAULT 1, "createdAt" datetime NOT NULL CONSTRAINT "DF_961c42aaf9bbde81821b4f84798" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_909ca09f39714bee330a77722a6" DEFAULT getdate(), "deletedAt" datetime2, "serverId" uniqueidentifier, CONSTRAINT "PK_43007cfb7dcbe43a2a17cb79978" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "trading_group" ADD CONSTRAINT "FK_4b7a016b25b8876b1051e9c4f20" FOREIGN KEY ("serverId") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "trading_group" DROP CONSTRAINT "FK_4b7a016b25b8876b1051e9c4f20"`,
    );
    await queryRunner.query(`DROP TABLE "trading_group"`);
  }
}
