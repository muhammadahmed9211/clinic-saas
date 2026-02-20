import { MigrationInterface, QueryRunner } from 'typeorm';

export class InboxEmailTableUpdate1726077848395 implements MigrationInterface {
  name = 'InboxEmailTableUpdate1726077848395';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inbox_email" ADD CONSTRAINT "leadId" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inbox_email" DROP CONSTRAINT "leadId"`,
    );
  }
}
