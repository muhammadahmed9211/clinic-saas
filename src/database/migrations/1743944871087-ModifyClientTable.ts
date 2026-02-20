import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyClientTable1743944871087 implements MigrationInterface {
  name = 'ModifyClientTable1743944871087';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "lastRetentionAssignAt" datetime`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "lastRetentionAssignAt"`,
    );
  }
}
