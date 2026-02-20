import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterNotes1721605337591 implements MigrationInterface {
  name = 'AlterNotes1721605337591';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notes" ADD "call_id" int`);
    await queryRunner.query(`ALTER TABLE "notes" ADD "meeting_id" int`);
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_f623eeea6f0bede7c9dfe1d7657" FOREIGN KEY ("call_id") REFERENCES "leads_call_log"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_823a22b622a8af0eeb59dc15fd4" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_823a22b622a8af0eeb59dc15fd4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_f623eeea6f0bede7c9dfe1d7657"`,
    );
    await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "meeting_id"`);
    await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "call_id"`);
  }
}
