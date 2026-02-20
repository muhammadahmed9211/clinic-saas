import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyOperatorTable1748260493574 implements MigrationInterface {
  name = 'ModifyOperatorTable1748260493574';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator" ADD "autoLeadReassign" bit NOT NULL CONSTRAINT "DF_cb9edbb8ec1154104e615fb17b9" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator" DROP COLUMN "autoLeadReassign"`,
    );
  }
}
