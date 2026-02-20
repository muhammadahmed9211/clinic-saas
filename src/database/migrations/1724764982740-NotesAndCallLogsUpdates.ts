import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotesAndCallLogsUpdates1724764982740
  implements MigrationInterface
{
  name = 'NotesAndCallLogsUpdates1724764982740';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notes" ADD "relatedToId" int`);
    await queryRunner.query(
      `ALTER TABLE "notes" ADD "relatedToName" nvarchar(max)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "relatedToName"`);
    await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "relatedToId"`);
  }
}
