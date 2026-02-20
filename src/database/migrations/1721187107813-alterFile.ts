import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterFile1721187107813 implements MigrationInterface {
  name = 'AlterFile1721187107813';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file" ADD "fileSize" nvarchar(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "fileSize"`);
  }
}
