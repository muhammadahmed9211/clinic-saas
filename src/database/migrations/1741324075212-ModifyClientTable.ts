import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyClientTable1741324075212 implements MigrationInterface {
  name = 'ModifyClientTable1741324075212';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "speakingLanguage"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "speakingLanguage" nvarchar(MAX)`,
    );
  }
}
