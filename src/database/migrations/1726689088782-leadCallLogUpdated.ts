import { MigrationInterface, QueryRunner } from 'typeorm';

export class LeadCallLogUpdated1726689088782 implements MigrationInterface {
  name = 'LeadCallLogUpdated1726689088782';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "leads_call_log" ADD "opportunityID" int`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "leads_call_log" DROP COLUMN "opportunityID"`,
    );
  }
}
