import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefaultQuestionGroup1707136895412 implements MigrationInterface {
  name = 'DefaultQuestionGroup1707136895412';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question" ALTER COLUMN "group" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question" ALTER COLUMN "group" nvarchar(255) NOT NULL`,
    );
  }
}
