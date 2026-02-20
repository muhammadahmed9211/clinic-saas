import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAnswer1718882862452 implements MigrationInterface {
  name = 'UserAnswer1718882862452';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_answer" DROP COLUMN "answerText"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_answer" ADD "answerText" nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_answer" DROP COLUMN "answerText"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_answer" ADD "answerText" text NOT NULL`,
    );
  }
}
