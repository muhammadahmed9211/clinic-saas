import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterClient1719793184254 implements MigrationInterface {
  name = 'AlterClient1719793184254';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "email_sent_for_review" bit NOT NULL CONSTRAINT "DF_6037cd8db52183b7667ae1b0a6e" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_6037cd8db52183b7667ae1b0a6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "email_sent_for_review"`,
    );
  }
}
