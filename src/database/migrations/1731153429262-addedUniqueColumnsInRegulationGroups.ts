import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedUniqueColumnsInRegulationGroups1731153429262
  implements MigrationInterface
{
  name = 'AddedUniqueColumnsInRegulationGroups1731153429262';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "regulation_config" ADD CONSTRAINT "UQ_de1692daf704ee157519a0b6afb" UNIQUE ("key", "groupId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulation_group" ADD CONSTRAINT "UQ_cb70b7deb2aedf8df60538684dd" UNIQUE ("regulationId", "key")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "regulation_group" DROP CONSTRAINT "UQ_cb70b7deb2aedf8df60538684dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "regulation_config" DROP CONSTRAINT "UQ_de1692daf704ee157519a0b6afb"`,
    );
  }
}
