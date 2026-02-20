import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRole1716969490816 implements MigrationInterface {
  name = 'UpdateRole1716969490816';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "DF_7c97c3702c94416a90e957c61fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "DF_7c97c3702c94416a90e957c61fe" DEFAULT 0 FOR "isReadOnly"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "DF_7c97c3702c94416a90e957c61fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "DF_7c97c3702c94416a90e957c61fe" DEFAULT 1 FOR "isReadOnly"`,
    );
  }
}
