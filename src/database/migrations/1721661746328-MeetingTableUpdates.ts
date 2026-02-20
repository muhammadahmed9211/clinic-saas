import { MigrationInterface, QueryRunner } from 'typeorm';

export class MeetingTableUpdates1721661746328 implements MigrationInterface {
  name = 'MeetingTableUpdates1721661746328';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meetings" ADD "completionReason" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "meetings" ADD "cancelReason" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "meetings" ADD "deleteReason" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meetings" DROP COLUMN "deleteReason"`,
    );
    await queryRunner.query(
      `ALTER TABLE "meetings" DROP COLUMN "cancelReason"`,
    );
    await queryRunner.query(
      `ALTER TABLE "meetings" DROP COLUMN "completionReason"`,
    );
  }
}
