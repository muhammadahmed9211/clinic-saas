import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyClientTable1743865614388 implements MigrationInterface {
  name = 'ModifyClientTable1743865614388';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "sendBackToSales" bit NOT NULL CONSTRAINT "DF_b410e36c0309846ac8c27a7c4b4" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "DF_b410e36c0309846ac8c27a7c4b4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "sendBackToSales"`,
    );
  }
}
