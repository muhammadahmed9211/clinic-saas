import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserKycAnswerTableAltered1709735144971
  implements MigrationInterface
{
  name = 'UserKycAnswerTableAltered1709735144971';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_answer" ALTER COLUMN "answerId" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_answer" ALTER COLUMN "answerText" text NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_answer" ADD "answerText" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_answer" ALTER COLUMN "answerId" int NOT NULL`,
    );
  }
}
