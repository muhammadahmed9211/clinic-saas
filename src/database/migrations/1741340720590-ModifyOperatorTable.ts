import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyOperatorTable1741340720590 implements MigrationInterface {
  name = 'ModifyOperatorTable1741340720590';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator" DROP CONSTRAINT "DF_e9483f2724b93715c27cffeb894"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ADD CONSTRAINT "DF_e9483f2724b93715c27cffeb894" DEFAULT 0 FOR "autoLeadAssign"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator" DROP CONSTRAINT "DF_e9483f2724b93715c27cffeb894"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ADD CONSTRAINT "DF_e9483f2724b93715c27cffeb894" DEFAULT 1 FOR "autoLeadAssign"`,
    );
  }
}
