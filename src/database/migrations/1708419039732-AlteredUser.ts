import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlteredUser1708419039732 implements MigrationInterface {
  name = 'AlteredUser1708419039732';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "partnerId" int`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isBroker" bit NOT NULL CONSTRAINT "DF_1130a0f0aa685c5211051abe654" DEFAULT 0`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_92a00fa561c16ba10b29aa99be" ON "user" ("partnerId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_92a00fa561c16ba10b29aa99be" ON "user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_1130a0f0aa685c5211051abe654"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isBroker"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "partnerId"`);
  }
}
