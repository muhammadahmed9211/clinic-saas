import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUsers1705314704203 implements MigrationInterface {
  name = 'UpdateUsers1705314704203';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_471ff2ddd009928e0501b75a4b" ON "user"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bio"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "bio" nvarchar(255)`);
    await queryRunner.query(
      `CREATE INDEX "IDX_471ff2ddd009928e0501b75a4b" ON "user" ("bio") `,
    );
  }
}
