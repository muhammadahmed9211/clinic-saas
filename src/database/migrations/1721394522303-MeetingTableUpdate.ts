import { MigrationInterface, QueryRunner } from 'typeorm';

export class MeetingTableUpdate1721394522303 implements MigrationInterface {
  name = 'MeetingTableUpdate1721394522303';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meetings" DROP CONSTRAINT "FK_9733fa31d47dbc274c2cf93b8d2"`,
    );
    await queryRunner.query(`ALTER TABLE "meetings" ADD "leadId" int`);
    await queryRunner.query(
      `ALTER TABLE "meetings" ADD CONSTRAINT "FK_06ab1cbf2f97a3d953c0167e1d4" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meetings" DROP CONSTRAINT "FK_06ab1cbf2f97a3d953c0167e1d4"`,
    );
    await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "leadId"`);
    await queryRunner.query(
      `ALTER TABLE "meetings" ADD CONSTRAINT "FK_9733fa31d47dbc274c2cf93b8d2" FOREIGN KEY ("relatedToId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
