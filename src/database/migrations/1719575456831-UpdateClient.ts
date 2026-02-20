import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateClient1719575456831 implements MigrationInterface {
  name = 'UpdateClient1719575456831';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "campaignQuestions" nvarchar(MAX)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "campaignQuestions"`,
    );
  }
}
