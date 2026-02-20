import { MigrationInterface, QueryRunner } from 'typeorm';

export class Question1708502899353 implements MigrationInterface {
  name = 'Question1708502899353';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_answer" ADD CONSTRAINT "FK_39bb21c637a8c11e2f3abd527e6" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_answer" DROP CONSTRAINT "FK_39bb21c637a8c11e2f3abd527e6"`,
    );
  }
}
