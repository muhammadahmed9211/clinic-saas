import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableMeetings1725356320783 implements MigrationInterface {
  name = 'AlterTableMeetings1725356320783';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meetings" ADD "fromEmail" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "fromEmail"`);
  }
}
