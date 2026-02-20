import { MigrationInterface, QueryRunner } from 'typeorm';

export class CallLogEndTime1718476427486 implements MigrationInterface {
  name = 'CallLogEndTime1718476427486';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "call_log" ADD "callEndDateTime" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_log" ADD "callDuration" varchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "call_log" DROP COLUMN "callDuration"`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_log" DROP COLUMN "callEndDateTime"`,
    );
  }
}
