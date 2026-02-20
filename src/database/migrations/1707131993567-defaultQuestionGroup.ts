import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefaultQuestionGroup1707131993567 implements MigrationInterface {
  name = 'DefaultQuestionGroup1707131993567';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question" ADD "group" nvarchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "group"`);
  }
}
