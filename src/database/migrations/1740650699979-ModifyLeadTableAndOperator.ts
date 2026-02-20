import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyLeadTableAndOperator1740650699979
  implements MigrationInterface
{
  name = 'ModifyLeadTableAndOperator1740650699979';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "speakingLanguage" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ADD "speakingLanguage" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" ADD "autoLeadAssign" bit NOT NULL CONSTRAINT "DF_e9483f2724b93715c27cffeb894" DEFAULT 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator" DROP CONSTRAINT "DF_e9483f2724b93715c27cffeb894"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" DROP COLUMN "autoLeadAssign"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operator" DROP COLUMN "speakingLanguage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" DROP COLUMN "speakingLanguage"`,
    );
  }
}
