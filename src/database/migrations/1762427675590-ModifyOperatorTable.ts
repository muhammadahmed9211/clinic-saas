import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyOperatorTable1762427675590 implements MigrationInterface {
  name = 'ModifyOperatorTable1762427675590';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator" ADD "isFirstLogin" bit NOT NULL CONSTRAINT "DF_c87a54d677c83e41a37c36a1d64" DEFAULT 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator" DROP COLUMN "isFirstLogin"`,
    );
  }
}
