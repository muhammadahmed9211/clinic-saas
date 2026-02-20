import { MigrationInterface, QueryRunner } from 'typeorm';

export class MeetingsTableAltered1722680271714 implements MigrationInterface {
  name = 'MeetingsTableAltered1722680271714';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meetings" DROP CONSTRAINT "FK_f4c16c40d16a9eb2003c5dd1ff2"`,
    );

    await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "hostId"`);
    await queryRunner.query(`ALTER TABLE "meetings" ADD "hostId" bigint`);
    await queryRunner.query(
      `ALTER TABLE "meetings" ADD CONSTRAINT "FK_f4c16c40d16a9eb2003c5dd1ff2" FOREIGN KEY ("hostId") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meetings" DROP CONSTRAINT "FK_f4c16c40d16a9eb2003c5dd1ff2"`,
    );
    await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "hostId"`);
    await queryRunner.query(`ALTER TABLE "meetings" ADD "hostId" int`);
    await queryRunner.query(
      `ALTER TABLE "meetings" ADD CONSTRAINT "FK_f4c16c40d16a9eb2003c5dd1ff2" FOREIGN KEY ("hostId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
