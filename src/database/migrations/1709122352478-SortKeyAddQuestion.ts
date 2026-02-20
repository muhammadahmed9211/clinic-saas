import { MigrationInterface, QueryRunner } from 'typeorm';

export class SortKeyAddQuestion1709122352478 implements MigrationInterface {
  name = 'SortKeyAddQuestion1709122352478';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question" ADD "sort" int CONSTRAINT "DF_263bb5cc723d07f242246dc4091" DEFAULT 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "DF_263bb5cc723d07f242246dc4091"`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "sort"`);
  }
}
