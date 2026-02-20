import { MigrationInterface, QueryRunner } from 'typeorm';

export class MeetingsTableUpdated1721050101406 implements MigrationInterface {
  name = 'MeetingsTableUpdated1721050101406';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meetings" DROP CONSTRAINT "FK_9733fa31d47dbc274c2cf93b8d2"`,
    );
    await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "relatedToId"`);
    await queryRunner.query(`ALTER TABLE "meetings" ADD "relatedToId" int`);
    await queryRunner.query(
      `ALTER TABLE "meetings" ADD CONSTRAINT "FK_9733fa31d47dbc274c2cf93b8d2" FOREIGN KEY ("relatedToId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meetings" DROP CONSTRAINT "FK_9733fa31d47dbc274c2cf93b8d2"`,
    );
    await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "relatedToId"`);
    await queryRunner.query(`ALTER TABLE "meetings" ADD "relatedToId" bigint`);
    await queryRunner.query(
      `ALTER TABLE "meetings" ADD CONSTRAINT "FK_9733fa31d47dbc274c2cf93b8d2" FOREIGN KEY ("relatedToId") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
