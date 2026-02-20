import { MigrationInterface, QueryRunner } from 'typeorm';

export class TranscationTableAddDeletedAt1710167534016
  implements MigrationInterface
{
  name = 'TranscationTableAddDeletedAt1710167534016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "deletedAt" datetime2`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "deletedAt"`,
    );
  }
}
