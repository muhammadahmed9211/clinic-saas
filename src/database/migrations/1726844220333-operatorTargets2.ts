import { MigrationInterface, QueryRunner } from 'typeorm';

export class OperatorTargets21726844220333 implements MigrationInterface {
  name = 'OperatorTargets21726844220333';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "operator_targets" ("id" int NOT NULL IDENTITY(1,1), "monthly_deposit" float CONSTRAINT "DF_b59cd254e4621b44f8b027c73e1" DEFAULT 0, "w01_deposit" float CONSTRAINT "DF_91c36f878ab726f711e2b7aadbc" DEFAULT 0, "w02_deposit" float CONSTRAINT "DF_f8bd6217ccfa7c204c157cfbbc0" DEFAULT 0, "w03_deposit" float CONSTRAINT "DF_e0a7011ca9ba7987fe9869c72fb" DEFAULT 0, "w04_deposit" float CONSTRAINT "DF_63c67359b93b19a1aa3ea277d7b" DEFAULT 0, "daily_lots" float CONSTRAINT "DF_6672a178f5534e43aa6f2e3e9a3" DEFAULT 0, "created_at" datetime2 NOT NULL CONSTRAINT "DF_bfc6257681accd63641a5d6797d" DEFAULT getdate(), "deleted_at" datetime2, "updated_at" datetime2 NOT NULL CONSTRAINT "DF_edc0fd32aa75f7a9e49e7abb67b" DEFAULT getdate(), "operatorId" bigint, CONSTRAINT "PK_7506dac6fd6716ea43c4119b8c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0edc5e11866bf6c6c0e09d40dc" ON "operator_targets" ("operatorId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "operator_targets" ADD CONSTRAINT "FK_0edc5e11866bf6c6c0e09d40dc6" FOREIGN KEY ("operatorId") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator_targets" ADD "month" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator_targets" ADD "year" varchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator_targets" DROP COLUMN "year"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator_targets" DROP COLUMN "month"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator_targets" DROP CONSTRAINT "FK_0edc5e11866bf6c6c0e09d40dc6"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_0edc5e11866bf6c6c0e09d40dc" ON "operator_targets"`,
    );
    await queryRunner.query(`DROP TABLE "operator_targets"`);
  }
}
