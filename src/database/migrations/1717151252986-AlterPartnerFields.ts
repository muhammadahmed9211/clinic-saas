import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterPartnerFields1717151252986 implements MigrationInterface {
  name = 'AlterPartnerFields1717151252986';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "getUsers" bit CONSTRAINT "DF_f813d70a667ca902a0b6b217d8d" DEFAULT 0`,
    );
    await queryRunner.query(`ALTER TABLE "partner" ADD "getUsersRL" bit`);
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "getUserRLInterval" int`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner" DROP COLUMN "getUserRLInterval"`,
    );
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "getUsersRL"`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "getUsers"`);
  }
}
