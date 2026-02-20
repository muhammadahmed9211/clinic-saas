import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyClientTable1740728204211 implements MigrationInterface {
  name = 'ModifyClientTable1740728204211';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "speakingLanguage" nvarchar(MAX)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "speakingLanguage"`,
    );
  }
}
