import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransectionExportTableUpdate1721829227807
  implements MigrationInterface
{
  name = 'TransectionExportTableUpdate1721829227807';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exported_transactions" ADD "url" nvarchar(MAX)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exported_transactions" ADD "url" nvarchar(255)`,
    );
  }
}
