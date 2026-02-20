import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedLeadRelationToAnswerTable1722340494902
  implements MigrationInterface
{
  name = 'AddedLeadRelationToAnswerTable1722340494902';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lead_answer" ADD "leadId" int`);
    await queryRunner.query(
      `ALTER TABLE "lead_answer" ADD CONSTRAINT "FK_fd41f93a68de1366537cbe4ced5" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead_answer" DROP CONSTRAINT "FK_fd41f93a68de1366537cbe4ced5"`,
    );
    await queryRunner.query(`ALTER TABLE "lead_answer" DROP COLUMN "leadId"`);
  }
}
