import { MigrationInterface, QueryRunner } from 'typeorm';

export class OperatorTargets1726659281446 implements MigrationInterface {
  name = 'OperatorTargets1726659281446';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "operator_targets" ("id" int NOT NULL IDENTITY(1,1), "type" nvarchar(255) CONSTRAINT CHK_c233168843d5f4345db4094dfa_ENUM CHECK(type IN ('sales','retention')), "monthly_deposit" float NOT NULL, "w01_deposit" float NOT NULL, "w02_deposit" float NOT NULL, "w03_deposit" float NOT NULL, "w04_deposit" float NOT NULL, "daily_lots" float NOT NULL, "operatorId" bigint, CONSTRAINT "PK_7506dac6fd6716ea43c4119b8c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0edc5e11866bf6c6c0e09d40dc" ON "operator_targets" ("operatorId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "operator_targets" ADD CONSTRAINT "FK_0edc5e11866bf6c6c0e09d40dc6" FOREIGN KEY ("operatorId") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator_targets" DROP CONSTRAINT "FK_0edc5e11866bf6c6c0e09d40dc6"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_0edc5e11866bf6c6c0e09d40dc" ON "operator_targets"`,
    );
    await queryRunner.query(`DROP TABLE "operator_targets"`);
  }
}
