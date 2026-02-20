import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyClientTable1744036003093 implements MigrationInterface {
  name = 'ModifyClientTable1744036003093';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "retentionAction" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "retentionAction"`,
    );
  }
}
