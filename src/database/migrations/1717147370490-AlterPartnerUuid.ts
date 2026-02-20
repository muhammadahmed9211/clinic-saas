import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterPartnerUuid1717147370490 implements MigrationInterface {
  name = 'AlterPartnerUuid1717147370490';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "hash"`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "uuid" uniqueidentifier`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "hash"`);
    await queryRunner.query(`ALTER TABLE "partner" ADD "uuid" nvarchar(255)`);
  }
}
