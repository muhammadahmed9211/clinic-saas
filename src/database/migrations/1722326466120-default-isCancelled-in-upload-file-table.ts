import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefaultIsCancelledInUploadFileTable1722326466120
  implements MigrationInterface
{
  name = 'DefaultIsCancelledInUploadFileTable1722326466120';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "data_upload" ADD "isCancelled" bit NOT NULL CONSTRAINT "DF_c99c78aa8a3c14874adbcec0b1c" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "data_upload" DROP CONSTRAINT "DF_c99c78aa8a3c14874adbcec0b1c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_upload" DROP COLUMN "isCancelled"`,
    );
  }
}
