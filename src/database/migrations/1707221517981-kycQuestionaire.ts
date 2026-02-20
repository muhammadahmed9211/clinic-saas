import { MigrationInterface, QueryRunner } from 'typeorm';

export class KycQuestionaire1707221517981 implements MigrationInterface {
  name = 'KycQuestionaire1707221517981';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "question" ADD "name" nvarchar(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "name"`);
  }
}
