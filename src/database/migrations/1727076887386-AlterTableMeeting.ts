import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableMeeting1727076887386 implements MigrationInterface {
  name = 'AlterTableMeeting1727076887386';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "meetings" ADD "createdById" bigint`);
    await queryRunner.query(
      `ALTER TABLE "meetings" ADD CONSTRAINT "FK_72dde91307ae781a66625c087e4" FOREIGN KEY ("createdById") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meetings" DROP CONSTRAINT "FK_72dde91307ae781a66625c087e4"`,
    );
    await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "createdById"`);
  }
}
