import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartnerAndOperatorAltered1718890175442
  implements MigrationInterface
{
  name = 'PartnerAndOperatorAltered1718890175442';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner" ADD "deleted_at" datetime2`);
    await queryRunner.query(
      `ALTER TABLE "operator" ADD "deleted_at" datetime2`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "operator" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "deleted_at"`);
  }
}
