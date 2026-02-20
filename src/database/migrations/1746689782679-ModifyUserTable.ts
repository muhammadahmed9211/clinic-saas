import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyUserTable1746689782679 implements MigrationInterface {
  name = 'ModifyUserTable1746689782679';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isTicketUser" bit NOT NULL CONSTRAINT "DF_ae53f4233e16627d0fd93ea76e9" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isTicketUser"`);
  }
}
