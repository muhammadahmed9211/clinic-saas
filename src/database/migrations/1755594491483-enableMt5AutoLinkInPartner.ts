import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnableMt5AutoLinkInPartner1755594491483
  implements MigrationInterface
{
  name = 'EnableMt5AutoLinkInPartner1755594491483';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_db612f60d89041145c86d5f748a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "DF_db612f60d89041145c86d5f748a" DEFAULT 1 FOR "autoLinkMt5"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "FK_a47c54e1f4dd2fd43faed52a2a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" DROP CONSTRAINT "DF_db612f60d89041145c86d5f748a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD CONSTRAINT "DF_db612f60d89041145c86d5f748a" DEFAULT 0 FOR "autoLinkMt5"`,
    );
  }
}
