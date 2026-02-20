import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateLeadsCallLogsTable1724839613537
  implements MigrationInterface
{
  name = 'UpdateLeadsCallLogsTable1724839613537';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "leads_call_log" ADD "callOwnerId" int`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "leads_call_log" DROP COLUMN "callOwnerId"`,
    );
  }
}
