import { MigrationInterface, QueryRunner } from 'typeorm';

export class InboxEmailUpdated1725871835865 implements MigrationInterface {
  name = 'InboxEmailUpdated1725871835865';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inbox_email" ADD "status" nvarchar(255) NOT NULL CONSTRAINT "DF_06cd77601ccd5937d15186e6957" DEFAULT 'Read'`,
    );
    await queryRunner.query(
      `ALTER TABLE "inbox_email" ADD CONSTRAINT "emailId" FOREIGN KEY ("emailId") REFERENCES "email_list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inbox_email" DROP CONSTRAINT "DF_06cd77601ccd5937d15186e6957"`,
    );
    await queryRunner.query(`ALTER TABLE "inbox_email" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "inbox_email" DROP CONSTRAINT "emailId"`,
    );
  }
}
