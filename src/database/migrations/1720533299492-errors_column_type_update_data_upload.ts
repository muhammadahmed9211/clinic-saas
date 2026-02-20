import { MigrationInterface, QueryRunner } from 'typeorm';

export class ErrorsColumnTypeUpdateDataUpload1720533299492
  implements MigrationInterface
{
  name = 'ErrorsColumnTypeUpdateDataUpload1720533299492';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "data_upload" DROP COLUMN "errors"`);
    await queryRunner.query(
      `ALTER TABLE "data_upload" ADD "errors" nvarchar(max)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "data_upload" DROP COLUMN "errors"`);
    await queryRunner.query(`ALTER TABLE "data_upload" ADD "errors" text`);
  }
}
