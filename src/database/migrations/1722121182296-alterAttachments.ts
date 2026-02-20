import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterAttachments1722121182296 implements MigrationInterface {
  name = 'AlterAttachments1722121182296';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "attachments" ADD "meetingId" int`);
    await queryRunner.query(
      `ALTER TABLE "attachments" ADD CONSTRAINT "FK_929cda4245d43571f45f5504dc6" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "attachments" DROP CONSTRAINT "FK_929cda4245d43571f45f5504dc6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" DROP COLUMN "meetingId"`,
    );
  }
}
