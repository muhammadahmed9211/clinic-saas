import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyClientTable1764244158601 implements MigrationInterface {
  name = 'ModifyClientTable1764244158601';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "isFirstTimeNameChange" bit NOT NULL CONSTRAINT "DF_24e19bd3732d6f847dc8c87dafe" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "isFirstTimeNameChange"`,
    );
  }
}
