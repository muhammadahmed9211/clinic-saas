import { MigrationInterface, QueryRunner } from 'typeorm';

export class ColumnUpdateUploadData1720177049126 implements MigrationInterface {
  name = 'ColumnUpdateUploadData1720177049126';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "data_upload" DROP COLUMN "errors"`);
    await queryRunner.query(`ALTER TABLE "data_upload" ADD "errors" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "data_upload" DROP COLUMN "errors"`);
    await queryRunner.query(
      `ALTER TABLE "data_upload" ADD "errors" nvarchar(255)`,
    );
  }
}
