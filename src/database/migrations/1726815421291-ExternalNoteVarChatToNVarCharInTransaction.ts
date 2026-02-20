import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExternalNoteVarChatToNVarCharInTransaction1726815421291
  implements MigrationInterface
{
  name = 'ExternalNoteVarChatToNVarCharInTransaction1726815421291';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "externalNote" nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS AS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "externalNote" varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS AS NULL`,
    );
  }
}
