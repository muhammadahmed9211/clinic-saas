import { MigrationInterface, QueryRunner } from 'typeorm';

export class Transaction1707739789252 implements MigrationInterface {
  name = 'Transaction1707739789252';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" int NOT NULL IDENTITY(1,1), "amount" int NOT NULL, "currency" varchar(100) NOT NULL, "country" varchar(15) NOT NULL, "type" varchar(15) NOT NULL, "status" nvarchar(255) CONSTRAINT CHK_5c3225cc2e04bee8727544c3d6_ENUM CHECK(status IN ('0','1','2','3','4')) NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_83cb622ce2d74c56db3e0c29f19" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_253f6b005b632dbac80cff5020c" DEFAULT getdate(), "userId" int, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_605baeb040ff0fae995404cea3" ON "transaction" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_605baeb040ff0fae995404cea3" ON "transaction"`,
    );
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
