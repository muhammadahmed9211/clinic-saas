import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlteredClientUserTables1710746189013
  implements MigrationInterface
{
  name = 'AlteredClientUserTables1710746189013';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" ADD "isDeleted" bit`);
    await queryRunner.query(`ALTER TABLE "user" ADD "isDeleted" bit`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isDeleted"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "isDeleted"`);
  }
}
