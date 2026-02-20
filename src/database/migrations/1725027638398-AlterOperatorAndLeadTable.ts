import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterOperatorAndLeadTable1725027638398
  implements MigrationInterface
{
  name = 'AlterOperatorAndLeadTable1725027638398';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lead" ADD "salesManagerId" int`);
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "desk_id" varchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operator" ALTER COLUMN "desk_id" int`,
    );
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "salesManagerId"`);
  }
}
