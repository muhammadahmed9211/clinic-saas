import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyRegulationRule1734008735344 implements MigrationInterface {
  name = 'ModifyRegulationRule1734008735344';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "regulation_rule" ADD "enumValue" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "regulation_rule" DROP COLUMN "enumValue"`,
    );
  }
}
