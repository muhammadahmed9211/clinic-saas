import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableMeetings1726735803454 implements MigrationInterface {
  name = 'AlterTableMeetings1726735803454';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_task" DROP CONSTRAINT "CHK_e3af554009c9a3f1218db4b48e"`,
    );
    await queryRunner.query(`ALTER TABLE "meetings" ADD "opportunityID" int`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meetings" DROP COLUMN "opportunityID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_task" ADD CONSTRAINT "CHK_e3af554009c9a3f1218db4b48e" CHECK (([entity]='lead' OR [entity]='transaction' OR [entity]='partner' OR [entity]='operator' OR [entity]='client' OR [entity]='general'))`,
    );
  }
}
