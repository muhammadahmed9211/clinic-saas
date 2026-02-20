import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedReasonInTransaction1727943374119
  implements MigrationInterface
{
  name = 'AddedReasonInTransaction1727943374119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "reason" nvarchar(max)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "reason"`);
  }
}
