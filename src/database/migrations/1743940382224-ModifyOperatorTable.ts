import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyOperatorTable1743940382224 implements MigrationInterface {
  name = 'ModifyOperatorTable1743940382224';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator" ADD "autoClientAssign" bit NOT NULL CONSTRAINT "DF_f9cca3843b8c10748bf8cc6bf15" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator" DROP CONSTRAINT "DF_f9cca3843b8c10748bf8cc6bf15"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" DROP COLUMN "autoClientAssign"`,
    );
  }
}
