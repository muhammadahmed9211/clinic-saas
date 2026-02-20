import { MigrationInterface, QueryRunner } from 'typeorm';

export class ALTEREDTABLEFILE1711544706690 implements MigrationInterface {
  name = 'ALTEREDTABLEFILE1711544706690';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file" ADD "fileName" nvarchar(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "fileName"`);
  }
}
