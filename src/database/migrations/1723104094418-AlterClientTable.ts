import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterClientTable1723104094418 implements MigrationInterface {
  name = 'AlterClientTable1723104094418';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" ADD "tel" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "user" ADD "tel" nvarchar(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tel"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "tel"`);
  }
}
