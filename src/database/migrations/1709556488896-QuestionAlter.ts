import { MigrationInterface, QueryRunner } from 'typeorm';

export class QuestionAlter1709556488896 implements MigrationInterface {
  name = 'QuestionAlter1709556488896';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question" ALTER COLUMN "title" text NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "desc" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "desc"`);
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "title"`);
  }
}
