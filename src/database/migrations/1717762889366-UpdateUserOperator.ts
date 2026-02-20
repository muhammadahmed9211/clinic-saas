import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserOperator1717762889366 implements MigrationInterface {
  name = 'UpdateUserOperator1717762889366';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "operatorId" bigint`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_02680328b0bc6de5319b274c2c" ON "user" ("operatorId") WHERE "operatorId" IS NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_02680328b0bc6de5319b274c2c6" FOREIGN KEY ("operatorId") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_02680328b0bc6de5319b274c2c6"`,
    );
    await queryRunner.query(
      `DROP INDEX "REL_02680328b0bc6de5319b274c2c" ON "user"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "operatorId"`);
  }
}
