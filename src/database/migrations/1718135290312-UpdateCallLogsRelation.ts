import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCallLogsRelation1718135290312 implements MigrationInterface {
  name = 'UpdateCallLogsRelation1718135290312';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "call_log" ADD "userId" int`);
    await queryRunner.query(
      `ALTER TABLE "call_log" ADD CONSTRAINT "FK_257433637011dd9298100bd1a58" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "call_log" DROP CONSTRAINT "FK_257433637011dd9298100bd1a58"`,
    );
    await queryRunner.query(`ALTER TABLE "call_log" DROP COLUMN "userId"`);
  }
}
