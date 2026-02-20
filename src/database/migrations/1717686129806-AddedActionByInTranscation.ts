import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedActionByInTranscation1717686129806
  implements MigrationInterface
{
  name = 'AddedActionByInTranscation1717686129806';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "actionById" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_1c0d92a491b73292a10dd2ee620" FOREIGN KEY ("actionById") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_1c0d92a491b73292a10dd2ee620"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "actionById"`,
    );
  }
}
