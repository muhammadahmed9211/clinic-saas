import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedExternalNoteInTranscation1718886984793
  implements MigrationInterface
{
  name = 'AddedExternalNoteInTranscation1718886984793';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "externalNote" varchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "externalNote"`,
    );
  }
}
